import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const DatabaseTester = () => {
  const { isDarkMode } = useDarkMode();
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test 1: Backend Health
      results.health = await fetch('http://localhost:5000/api/health')
        .then(r => r.json())
        .then(data => ({ success: true, data }))
        .catch(err => ({ success: false, error: err.message }));

      // Test 2: Profiles Search (no auth required)
      results.profiles = await fetch('http://localhost:5000/api/profiles/search/workers')
        .then(r => r.json())
        .then(data => ({ success: true, data }))
        .catch(err => ({ success: false, error: err.message }));

      // Test 3: Check auth state
      const token = localStorage.getItem('auth_token');
      results.authState = {
        success: true,
        data: {
          hasToken: !!token,
          tokenPreview: token ? token.substring(0, 20) + '...' : 'No token'
        }
      };

      // Test 4: Connections (requires auth)
      if (token) {
        results.connections = await fetch('http://localhost:5000/api/connections/my-connections', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(r => r.json())
          .then(data => ({ success: true, data }))
          .catch(err => ({ success: false, error: err.message }));

        results.stats = await fetch('http://localhost:5000/api/connections/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(r => r.json())
          .then(data => ({ success: true, data }))
          .catch(err => ({ success: false, error: err.message }));
      } else {
        results.connections = { success: false, error: 'No auth token' };
        results.stats = { success: false, error: 'No auth token' };
      }

    } catch (error) {
      results.error = { success: false, error: error.message };
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    runTests();
  };

  const mockLogin = () => {
    // Create a mock token for testing
    localStorage.setItem('auth_token', 'mock-jwt-token-for-testing');
    localStorage.setItem('auth_user', JSON.stringify({
      id: 'mock-user-id',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      userType: 'worker'
    }));
    runTests();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>
          Friends Page Database Tester
        </h1>

        <div className="flex space-x-4 mb-6">
          <button
            onClick={runTests}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Run Tests'}
          </button>
          <button
            onClick={mockLogin}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Mock Login
          </button>
          <button
            onClick={clearAuth}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Auth
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(testResults).map(([testName, result]) => (
            <div
              key={testName}
              className={`p-4 rounded-lg border ${
                result.success
                  ? isDarkMode ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200'
                  : isDarkMode ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
              }`}
            >
              <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                {testName.toUpperCase()} {result.success ? '✅' : '❌'}
              </h3>
              <pre className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} overflow-auto`}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Instructions:
          </h3>
          <ul className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
            <li>1. If profiles test fails, backend may not be running on port 5000</li>
            <li>2. Use "Mock Login" to simulate authentication for testing connections</li>
            <li>3. Check if backend shows "MongoDB connected successfully"</li>
            <li>4. Green results mean the endpoint is working</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DatabaseTester;
