#!/usr/bin/env python3
"""
Backend API Testing Suite
Tests CORS, admin authentication, and Telegram settings functionality
"""

import requests
import json
import sys
import time
from typing import Dict, Any, Optional

# Configuration
BACKEND_URL = "http://localhost:8001"
API_BASE = f"{BACKEND_URL}/api"

# Test credentials
ADMIN_EMAIL = "admin@trading.com"
ADMIN_PASSWORD = "Admin@123456"

# Test data for Telegram settings
TELEGRAM_TEST_DATA = {
    "telegram_bot_token": "test_token_123",
    "telegram_admin_chat_id": "123456789",
    "telegram_notifications_enabled": True
}

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, message: str, details: Optional[Dict] = None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "details": details or {}
        })
        
        if not success:
            print(f"   Details: {details}")
    
    def test_cors_configuration(self) -> bool:
        """Test CORS configuration"""
        print("\n🔍 Testing CORS Configuration...")
        
        try:
            # Test preflight OPTIONS request
            response = self.session.options(
                f"{API_BASE}/",
                headers={
                    "Origin": "http://localhost:3000",
                    "Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers": "Content-Type,Authorization"
                }
            )
            
            cors_headers = {
                "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
                "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
                "Access-Control-Allow-Headers": response.headers.get("Access-Control-Allow-Headers"),
                "Access-Control-Allow-Credentials": response.headers.get("Access-Control-Allow-Credentials")
            }
            
            # Check if CORS headers are present
            has_cors = any(cors_headers.values())
            
            if has_cors:
                self.log_test(
                    "CORS Headers", 
                    True, 
                    "CORS headers are properly configured",
                    {"headers": cors_headers, "status_code": response.status_code}
                )
                return True
            else:
                self.log_test(
                    "CORS Headers", 
                    False, 
                    "CORS headers missing or misconfigured",
                    {"headers": cors_headers, "status_code": response.status_code}
                )
                return False
                
        except Exception as e:
            self.log_test(
                "CORS Configuration", 
                False, 
                f"Failed to test CORS: {str(e)}"
            )
            return False
    
    def test_admin_login(self) -> bool:
        """Test admin login functionality"""
        print("\n🔐 Testing Admin Login...")
        
        try:
            login_data = {
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            }
            
            response = self.session.post(
                f"{API_BASE}/admin/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.admin_token = data["access_token"]
                    self.session.headers.update({
                        "Authorization": f"Bearer {self.admin_token}"
                    })
                    
                    self.log_test(
                        "Admin Login", 
                        True, 
                        "Successfully logged in as admin",
                        {"token_type": data.get("token_type"), "has_refresh": "refresh_token" in data}
                    )
                    return True
                else:
                    self.log_test(
                        "Admin Login", 
                        False, 
                        "Login response missing access token",
                        {"response": data}
                    )
                    return False
            else:
                self.log_test(
                    "Admin Login", 
                    False, 
                    f"Login failed with status {response.status_code}",
                    {"response": response.text, "status_code": response.status_code}
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Admin Login", 
                False, 
                f"Login request failed: {str(e)}"
            )
            return False
    
    def test_get_settings(self) -> Dict[str, Any]:
        """Test GET /api/admin/settings endpoint"""
        print("\n📋 Testing GET Settings...")
        
        try:
            response = self.session.get(f"{API_BASE}/admin/settings")
            
            if response.status_code == 200:
                settings = response.json()
                self.log_test(
                    "GET Settings", 
                    True, 
                    "Successfully retrieved system settings",
                    {"settings_keys": list(settings.keys()) if isinstance(settings, dict) else "non-dict response"}
                )
                return settings
            else:
                self.log_test(
                    "GET Settings", 
                    False, 
                    f"Failed to get settings with status {response.status_code}",
                    {"response": response.text, "status_code": response.status_code}
                )
                return {}
                
        except Exception as e:
            self.log_test(
                "GET Settings", 
                False, 
                f"Settings request failed: {str(e)}"
            )
            return {}
    
    def test_update_settings(self) -> bool:
        """Test PUT /api/admin/settings endpoint with Telegram configuration"""
        print("\n⚙️ Testing PUT Settings (Telegram Configuration)...")
        
        try:
            response = self.session.put(
                f"{API_BASE}/admin/settings",
                json=TELEGRAM_TEST_DATA,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                self.log_test(
                    "PUT Settings", 
                    True, 
                    "Successfully updated Telegram settings",
                    {"response": data, "test_data": TELEGRAM_TEST_DATA}
                )
                return True
            else:
                self.log_test(
                    "PUT Settings", 
                    False, 
                    f"Failed to update settings with status {response.status_code}",
                    {"response": response.text, "status_code": response.status_code, "test_data": TELEGRAM_TEST_DATA}
                )
                return False
                
        except Exception as e:
            self.log_test(
                "PUT Settings", 
                False, 
                f"Settings update failed: {str(e)}"
            )
            return False
    
    def test_settings_persistence(self) -> bool:
        """Test that settings are saved correctly by retrieving them again"""
        print("\n💾 Testing Settings Persistence...")
        
        try:
            # Wait a moment for the update to be processed
            time.sleep(1)
            
            response = self.session.get(f"{API_BASE}/admin/settings")
            
            if response.status_code == 200:
                settings = response.json()
                
                # Check if Telegram settings were saved
                telegram_saved = all([
                    settings.get("telegram_bot_token") == TELEGRAM_TEST_DATA["telegram_bot_token"],
                    settings.get("telegram_admin_chat_id") == TELEGRAM_TEST_DATA["telegram_admin_chat_id"],
                    settings.get("telegram_notifications_enabled") == TELEGRAM_TEST_DATA["telegram_notifications_enabled"]
                ])
                
                if telegram_saved:
                    self.log_test(
                        "Settings Persistence", 
                        True, 
                        "Telegram settings were saved and retrieved correctly",
                        {
                            "saved_token": settings.get("telegram_bot_token"),
                            "saved_chat_id": settings.get("telegram_admin_chat_id"),
                            "saved_notifications": settings.get("telegram_notifications_enabled")
                        }
                    )
                    return True
                else:
                    self.log_test(
                        "Settings Persistence", 
                        False, 
                        "Telegram settings were not saved correctly",
                        {
                            "expected": TELEGRAM_TEST_DATA,
                            "actual": {
                                "telegram_bot_token": settings.get("telegram_bot_token"),
                                "telegram_admin_chat_id": settings.get("telegram_admin_chat_id"),
                                "telegram_notifications_enabled": settings.get("telegram_notifications_enabled")
                            }
                        }
                    )
                    return False
            else:
                self.log_test(
                    "Settings Persistence", 
                    False, 
                    f"Failed to retrieve settings for verification with status {response.status_code}",
                    {"response": response.text}
                )
                return False
                
        except Exception as e:
            self.log_test(
                "Settings Persistence", 
                False, 
                f"Settings persistence test failed: {str(e)}"
            )
            return False
    
    def test_other_endpoints(self) -> bool:
        """Test that other existing endpoints still work"""
        print("\n🔗 Testing Other Endpoints...")
        
        endpoints_to_test = [
            ("GET", "/api/", "Root endpoint"),
            ("GET", "/api/admin/auth/profile", "Admin profile"),
        ]
        
        all_passed = True
        
        for method, endpoint, description in endpoints_to_test:
            try:
                if method == "GET":
                    response = self.session.get(f"{BACKEND_URL}{endpoint}")
                else:
                    continue  # Skip non-GET methods for now
                
                # Consider 200-299 as success, 401 as expected for protected routes
                success = response.status_code < 400 or response.status_code == 401
                
                if success:
                    self.log_test(
                        f"Endpoint {endpoint}", 
                        True, 
                        f"{description} is accessible",
                        {"status_code": response.status_code, "method": method}
                    )
                else:
                    self.log_test(
                        f"Endpoint {endpoint}", 
                        False, 
                        f"{description} returned unexpected status",
                        {"status_code": response.status_code, "response": response.text[:200]}
                    )
                    all_passed = False
                    
            except Exception as e:
                self.log_test(
                    f"Endpoint {endpoint}", 
                    False, 
                    f"Failed to test {description}: {str(e)}"
                )
                all_passed = False
        
        return all_passed
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Backend API Tests...")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"API Base: {API_BASE}")
        
        # Test sequence
        tests = [
            ("CORS Configuration", self.test_cors_configuration),
            ("Admin Login", self.test_admin_login),
            ("GET Settings", lambda: bool(self.test_get_settings())),
            ("PUT Settings", self.test_update_settings),
            ("Settings Persistence", self.test_settings_persistence),
            ("Other Endpoints", self.test_other_endpoints),
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                print(f"❌ {test_name} failed with exception: {e}")
        
        # Summary
        print(f"\n📊 Test Summary:")
        print(f"   Passed: {passed}/{total}")
        print(f"   Failed: {total - passed}/{total}")
        
        if passed == total:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed. Check the details above.")
            return False

def main():
    """Main test runner"""
    tester = BackendTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()