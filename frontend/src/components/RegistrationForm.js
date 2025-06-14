import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../services/api';

const RegistrationForm = () => {
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

    // Initial Values - Define initial values for all form fields
    const initialValues = {
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    };

    // Validation Schema - Match the Yup schema to form fields
    const validationSchema = Yup.object({
        fullName: Yup.string()
            .required('Full Name is required')
            .typeError('Full Name must be a string'),

        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required')
            .typeError('Email must be a string'),

        phone: Yup.string()
            .matches(/^\d{10,15}$/, 'Phone must contain 10 to 15 digits only')
            .required('Phone is required')
            .typeError('Phone must be a string'),

        password: Yup.string()
            .min(6, 'Password must be at least 6 characters long')
            .required('Password is required')
            .typeError('Password must be a string'),

        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords do not match')
            .required('Confirm Password is required')
            .typeError('Confirm Password must be a string')
    });

    // Helper function to check if form is valid and complete
    const isFormValidAndComplete = (values, errors, touched) => {
        // Check if all fields have values
        const allFieldsFilled = Object.values(values).every(value =>
            value && value.toString().trim() !== ''
        );

        // Check if there are no validation errors
        const noErrors = Object.keys(errors).length === 0;

        // Check if all fields have been touched (user has interacted with them)
        const allFieldsTouched = Object.keys(values).every(field => touched[field]);

        return allFieldsFilled && noErrors && allFieldsTouched;
    };

    // Form Submission - Use onSubmit and isSubmitting for async handling
    const handleSubmit = async (values, { setSubmitting, resetForm, setFieldError }) => {
        try {
            setSubmitStatus({ type: '', message: '' });

            const response = await registerUser(values);

            if (response.success) {
                setSubmitStatus({
                    type: 'success',
                    message: 'Registration successful! Welcome aboard!'
                });
                resetForm();
            }
        } catch (error) {
            if (error.errors) {
                // Handle field-specific errors
                Object.keys(error.errors).forEach(field => {
                    setFieldError(field, error.errors[field]);
                });
            } else {
                setSubmitStatus({
                    type: 'error',
                    message: error.message || 'Registration failed. Please try again.'
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formCard}>
                <h1 style={styles.title}>Create Your Account</h1>

                {submitStatus.message && (
                    <div style={{
                        ...styles.alert,
                        ...(submitStatus.type === 'success' ? styles.alertSuccess : styles.alertError)
                    }}>
                        {submitStatus.message}
                    </div>
                )}

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, errors, touched, values }) => {
                        // Determine if button should be disabled
                        const isButtonDisabled = isSubmitting || !isFormValidAndComplete(values, errors, touched);

                        return (
                            <Form style={styles.form}>
                                {/* Full Name Field */}
                                <div style={styles.fieldGroup}>
                                    <label htmlFor="fullName" style={styles.label}>
                                        Full Name *
                                    </label>
                                    <Field
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        style={{
                                            ...styles.input,
                                            ...(errors.fullName && touched.fullName ? styles.inputError : {})
                                        }}
                                        placeholder="Enter your full name"
                                    />
                                    <ErrorMessage
                                        name="fullName"
                                        component="div"
                                        style={styles.errorMessage}
                                    />
                                </div>

                                {/* Email Field */}
                                <div style={styles.fieldGroup}>
                                    <label htmlFor="email" style={styles.label}>
                                        Email Address *
                                    </label>
                                    <Field
                                        type="email"
                                        id="email"
                                        name="email"
                                        style={{
                                            ...styles.input,
                                            ...(errors.email && touched.email ? styles.inputError : {})
                                        }}
                                        placeholder="Enter your email address"
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        style={styles.errorMessage}
                                    />
                                </div>

                                {/* Phone Field */}
                                <div style={styles.fieldGroup}>
                                    <label htmlFor="phone" style={styles.label}>
                                        Phone Number *
                                    </label>
                                    <Field
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        style={{
                                            ...styles.input,
                                            ...(errors.phone && touched.phone ? styles.inputError : {})
                                        }}
                                        placeholder="Enter your phone number (10-15 digits)"
                                    />
                                    <ErrorMessage
                                        name="phone"
                                        component="div"
                                        style={styles.errorMessage}
                                    />
                                </div>

                                {/* Password Field */}
                                <div style={styles.fieldGroup}>
                                    <label htmlFor="password" style={styles.label}>
                                        Password *
                                    </label>
                                    <Field
                                        type="password"
                                        id="password"
                                        name="password"
                                        style={{
                                            ...styles.input,
                                            ...(errors.password && touched.password ? styles.inputError : {})
                                        }}
                                        placeholder="Enter your password (min 6 characters)"
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        style={styles.errorMessage}
                                    />
                                </div>

                                {/* Confirm Password Field */}
                                <div style={styles.fieldGroup}>
                                    <label htmlFor="confirmPassword" style={styles.label}>
                                        Confirm Password *
                                    </label>
                                    <Field
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        style={{
                                            ...styles.input,
                                            ...(errors.confirmPassword && touched.confirmPassword ? styles.inputError : {})
                                        }}
                                        placeholder="Confirm your password"
                                    />
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="div"
                                        style={styles.errorMessage}
                                    />
                                </div>

                                {/* Submit Button - Disabled when form is invalid or incomplete */}
                                <button
                                    type="submit"
                                    disabled={isButtonDisabled}
                                    style={{
                                        ...styles.submitButton,
                                        ...(isButtonDisabled ? styles.submitButtonDisabled : styles.submitButtonEnabled)
                                    }}
                                    title={isButtonDisabled && !isSubmitting ? "Please fill all fields correctly" : ""}
                                >
                                    {isSubmitting ? 'Creating Account...' : 'Create Account'}
                                </button>

                                {/* Optional: Display form completion status */}
                                {!isFormValidAndComplete(values, errors, touched) && (
                                    <div style={styles.formStatus}>
                                        <p style={styles.formStatusText}>
                                            Please complete all required fields to enable account creation
                                        </p>
                                    </div>
                                )}
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
};

// Updated styles with enhanced button states
const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
    },
    formCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '500px'
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '28px',
        fontWeight: 'bold'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontWeight: '600',
        color: '#333',
        fontSize: '14px'
    },
    input: {
        padding: '12px',
        border: '2px solid #e1e5e9',
        borderRadius: '6px',
        fontSize: '16px',
        transition: 'border-color 0.3s ease',
        outline: 'none'
    },
    inputError: {
        borderColor: '#e74c3c'
    },
    errorMessage: {
        color: '#e74c3c',
        fontSize: '14px',
        fontWeight: '500'
    },
    submitButton: {
        padding: '14px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        marginTop: '10px'
    },
    submitButtonEnabled: {
        backgroundColor: '#3498db',
        color: 'white',
        cursor: 'pointer',
        transform: 'scale(1)',
        boxShadow: '0 2px 4px rgba(52, 152, 219, 0.3)'
    },
    submitButtonDisabled: {
        backgroundColor: '#bdc3c7',
        color: '#7f8c8d',
        cursor: 'not-allowed',
        transform: 'scale(0.98)',
        boxShadow: 'none',
        opacity: '0.6'
    },
    alert: {
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '20px',
        fontWeight: '500'
    },
    alertSuccess: {
        backgroundColor: '#d4edda',
        color: '#155724',
        border: '1px solid #c3e6cb'
    },
    alertError: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb'
    },
    formStatus: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '6px',
        textAlign: 'center'
    },
    formStatusText: {
        margin: '0',
        color: '#856404',
        fontSize: '14px',
        fontWeight: '500'
    }
};

export default RegistrationForm;
