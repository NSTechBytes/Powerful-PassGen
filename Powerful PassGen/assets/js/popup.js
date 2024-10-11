document.addEventListener('DOMContentLoaded', function () {
    const passwordField = document.getElementById('password');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const lengthField = document.getElementById('length');
    const includeLettersCheckbox = document.getElementById('include-letters');
    const includeNumbersCheckbox = document.getElementById('include-numbers');
    const includeSymbolsCheckbox = document.getElementById('include-symbols');
    const copyMessage = document.getElementById('copy-message');
    const themeSwitch = document.getElementById('theme-switch');
    const themeLabel = document.getElementById('theme-label');

    // Function to generate a random password based on user preferences
    function generatePassword(length, includeLetters, includeNumbers, includeSymbols) {
        let charset = '';
        if (includeLetters) {
            charset += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if (includeNumbers) {
            charset += '0123456789';
        }
        if (includeSymbols) {
            charset += '!@#$%^&*()_+<>?';
        }

        if (charset === '') {
            return 'Please select at least one option';  // Error message
        }

        let password = '';
        for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return password;
    }

    // Function to show and hide the "Password copied" message
    function showCopyMessage() {
        copyMessage.classList.remove('hidden');
        copyMessage.classList.add('visible');
        
        // Hide the message after 2 seconds
        setTimeout(function () {
            copyMessage.classList.remove('visible');
            copyMessage.classList.add('hidden');
        }, 2000);
    }

    // Load the user's theme preference and apply it
    function applyThemePreference(theme) {
        if (theme === 'dark') {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            themeSwitch.checked = true;
            themeLabel.textContent = 'Dark Mode';
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            themeSwitch.checked = false;
            themeLabel.textContent = 'Light Mode';
        }
    }

    // Load theme preference from Chrome storage
    chrome.storage.sync.get(['theme'], function(result) {
        if (result.theme) {
            applyThemePreference(result.theme);
        } else {
            // Default to light mode if no preference is stored
            applyThemePreference('light');
        }
    });

    // Event listener for the 'Generate Password' button
    generateBtn.addEventListener('click', function () {
        const length = parseInt(lengthField.value);  // Get the selected length
        const includeLetters = includeLettersCheckbox.checked;  // Get checkbox states
        const includeNumbers = includeNumbersCheckbox.checked;
        const includeSymbols = includeSymbolsCheckbox.checked;

        const newPassword = generatePassword(length, includeLetters, includeNumbers, includeSymbols);
        passwordField.value = newPassword;  // Set the generated password in the input field
    });

    // Event listener for the 'Copy' button
    copyBtn.addEventListener('click', function () {
        passwordField.select();
        document.execCommand('copy');

        // Show the copy message
        showCopyMessage();
    });

    // Dark/Light mode toggle
    themeSwitch.addEventListener('change', function () {
        if (themeSwitch.checked) {
            applyThemePreference('dark');
        } else {
            applyThemePreference('light');
        }

        // Save theme preference to Chrome storage
        chrome.storage.sync.set({theme: themeSwitch.checked ? 'dark' : 'light'});
    });
});
