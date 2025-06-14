from flask import Blueprint, request, jsonify
from models.user import User
import re

auth_bp = Blueprint("auth", __name__)
user_model = User()


@auth_bp.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()

        # Server-side validation
        validation_errors = validate_registration_data(data)
        if validation_errors:
            return jsonify({"success": False, "errors": validation_errors}), 400

        # Check if email already exists
        if user_model.email_exists(data["email"]):
            return (
                jsonify({"success": False, "message": "Email already registered"}),
                409,
            )

        # Create user
        user_id = user_model.create_user(data)

        return (
            jsonify(
                {
                    "success": True,
                    "message": "User registered successfully",
                    "user_id": user_id,
                }
            ),
            201,
        )

    except Exception as e:
        return (
            jsonify({"success": False, "message": f"Registration failed: {str(e)}"}),
            500,
        )


def validate_registration_data(data):
    """Server-side validation for registration data"""
    errors = {}

    # Full Name validation
    if not data.get("fullName") or not data["fullName"].strip():
        errors["fullName"] = "Full Name is required"

    # Email validation
    email = data.get("email", "").strip()
    if not email:
        errors["email"] = "Email is required"
    elif not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        errors["email"] = "Invalid email format"

    # Phone validation
    phone = data.get("phone", "").strip()
    if not phone:
        errors["phone"] = "Phone is required"
    elif not re.match(r"^\d{10,15}$", phone):
        errors["phone"] = "Phone must contain 10 to 15 digits only"

    # Password validation
    password = data.get("password", "")
    if not password:
        errors["password"] = "Password is required"
    elif len(password) < 6:
        errors["password"] = "Password must be at least 6 characters long"

    # Confirm Password validation
    confirm_password = data.get("confirmPassword", "")
    if not confirm_password:
        errors["confirmPassword"] = "Confirm Password is required"
    elif password != confirm_password:
        errors["confirmPassword"] = "Passwords do not match"

    return errors
