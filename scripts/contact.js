document.addEventListener('DOMContentLoaded', () => {
    // Note: Google Forms font loading errors in console are from embedded Google Forms
    // and are not critical - they don't affect functionality
    
    // ---- Mobile Menu Toggle ----
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenu && mobileMenuBtn) {
        // Function to update button icon
        function updateButtonIcon(isOpen) {
            if (isOpen) {
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }

        // Function to toggle menu
        function toggleMenu() {
            const isActive = mobileMenu.classList.contains('active');
            
            if (isActive) {
                mobileMenu.classList.remove('active');
                updateButtonIcon(false);
            } else {
                mobileMenu.classList.add('active');
                updateButtonIcon(true);
            }
        }

        // Add click event to hamburger button
        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking on menu links
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                updateButtonIcon(false);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                if (mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    updateButtonIcon(false);
                }
            }
        });
    }

    // --- Button and Overlay Logic ---
    const newConstructionBtn = document.getElementById('new-construction-btn');
    const renovationBtn = document.getElementById('renovation-btn');
    const newConstructionOverlay = document.getElementById('new-construction-overlay');
    const renovationOverlay = document.getElementById('renovation-overlay');
    const closeBtns = document.querySelectorAll('.close-btn');

    // Form instances to track state
    const formInstances = new Map();

    function openForm(overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Initialize form if not already done (only for custom forms, not Google Forms)
        const form = overlay.querySelector('.contact-form');
        if (form && !formInstances.has(form)) {
            formInstances.set(form, new MultiStepForm(form));
        }
    }

    function closeForm() {
        const activeOverlay = document.querySelector('.form-overlay.active');
        if (activeOverlay) {
            activeOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Event listeners
    newConstructionBtn?.addEventListener('click', () => openForm(newConstructionOverlay));
    renovationBtn?.addEventListener('click', () => openForm(renovationOverlay));
    closeBtns.forEach(btn => btn.addEventListener('click', closeForm));

    // Close form when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('form-overlay')) {
            closeForm();
        }
    });

    // --- Multi-Step Form Class ---
    class MultiStepForm {
        constructor(formElement) {
            this.form = formElement;
            this.steps = Array.from(formElement.querySelectorAll('.form-step'));
            this.currentStepIndex = 0;

            this.nextBtns = formElement.querySelectorAll('.next-btn');
            this.backBtns = formElement.querySelectorAll('.back-btn');
            this.submitBtn = formElement.querySelector('.submit-btn');

            this.init();
        }

        init() {
            // Add event listeners to all next buttons
            this.nextBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.nextStep();
                });
            });

            // Add event listeners to all back buttons
            this.backBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.prevStep();
                });
            });

            // Handle form submission
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitForm();
            });

            // Show initial step
            this.updateDisplay();
        }

        nextStep() {
            if (!this.validateCurrentStep()) {
                console.log('Validation failed for step', this.currentStepIndex);
                return;
            }

            if (this.currentStepIndex < this.steps.length - 1) {
                this.currentStepIndex++;
                this.updateDisplay();
                console.log('Advanced to step', this.currentStepIndex);
            }
        }

        prevStep() {
            if (this.currentStepIndex > 0) {
                this.currentStepIndex--;
                this.updateDisplay();
                console.log('Went back to step', this.currentStepIndex);
            }
        }

        updateDisplay() {
            // Update step visibility
            this.steps.forEach((step, index) => {
                if (index === this.currentStepIndex) {
                    step.classList.add('active');
                    step.style.display = 'flex';
                } else {
                    step.classList.remove('active');
                    step.style.display = 'none';
                }
            });

            // Update button visibility in current step
            const currentStep = this.steps[this.currentStepIndex];
            const navigation = currentStep.querySelector('.form-navigation');

            if (navigation) {
                const backBtn = navigation.querySelector('.back-btn');
                const nextBtn = navigation.querySelector('.next-btn');
                const submitBtn = navigation.querySelector('.submit-btn');

                // Show/hide back button
                if (backBtn) {
                    backBtn.style.display = this.currentStepIndex > 0 ? 'inline-block' : 'none';
                }

                // Show/hide next button
                if (nextBtn) {
                    nextBtn.style.display = this.currentStepIndex < this.steps.length - 1 ? 'inline-block' : 'none';
                }

                // Show/hide submit button
                if (submitBtn) {
                    submitBtn.style.display = this.currentStepIndex === this.steps.length - 1 ? 'inline-block' : 'none';
                }
            }

            console.log(`Updated display for step ${this.currentStepIndex} of ${this.steps.length}`);
        }

        validateCurrentStep() {
            const currentStep = this.steps[this.currentStepIndex];
            let isValid = true;

            console.log('Validating step', this.currentStepIndex);

            // Clear previous validation states
            currentStep.querySelectorAll('.invalid').forEach(el => {
                el.classList.remove('invalid');
            });

            // Validate text inputs, textareas, emails, etc.
            const requiredTextFields = currentStep.querySelectorAll('input[required]:not([type="radio"]):not([type="checkbox"]), textarea[required]');
            requiredTextFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('invalid');
                    isValid = false;
                    console.log('Required field empty:', field.name || field.id);
                }
            });

            // Validate radio button groups
            const radioGroups = this.getRadioGroups(currentStep);
            Object.keys(radioGroups).forEach(groupName => {
                const group = radioGroups[groupName];
                const hasRequiredRadio = group.some(radio => radio.hasAttribute('required'));

                if (hasRequiredRadio) {
                    const isGroupSelected = group.some(radio => radio.checked);
                    if (!isGroupSelected) {
                        group.forEach(radio => radio.classList.add('invalid'));
                        isValid = false;
                        console.log('Required radio group not selected:', groupName);
                    }
                }
            });

            // Validate checkbox groups (if any are required)
            const requiredCheckboxes = currentStep.querySelectorAll('input[type="checkbox"][required]');
            requiredCheckboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    checkbox.classList.add('invalid');
                    isValid = false;
                    console.log('Required checkbox not checked:', checkbox.name || checkbox.id);
                }
            });

            console.log('Step validation result:', isValid);
            return isValid;
        }

        getRadioGroups(stepElement) {
            const groups = {};
            const radios = stepElement.querySelectorAll('input[type="radio"]');

            radios.forEach(radio => {
                if (!groups[radio.name]) {
                    groups[radio.name] = [];
                }
                groups[radio.name].push(radio);
            });

            return groups;
        }

        createFormDataForGoogleForm() {
            const formData = new FormData();
            
            // Get all form inputs
            const inputs = this.form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                if (input.type === 'radio' && !input.checked) return;
                if (input.type === 'checkbox' && !input.checked) return;
                
                let value = input.value;
                let name = input.name;
                
                // Handle checkbox groups (multiple values for same field)
                if (input.type === 'checkbox' && input.checked) {
                    const existingValue = formData.get(name);
                    if (existingValue) {
                        value = existingValue + ', ' + value;
                    }
                }
                
                if (value && name) {
                    formData.append(name, value);
                }
            });
            
            // Add form type identifier
            formData.append('formType', this.form.id);
            
            return formData;
        }

        async submitForm() {
            if (!this.validateCurrentStep()) {
                console.log('Final validation failed');
                return;
            }

            // Create form data with proper field mapping for Google Forms
            const formData = this.createFormDataForGoogleForm();
            
            const webAppUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeoaByMTsWmh0nY7TD9pU1sdB5QNWbORB3se4ooYKlz6vkuWQ/formResponse';

            if (this.submitBtn) {
                this.submitBtn.disabled = true;
                this.submitBtn.textContent = "Submitting...";
                this.submitBtn.classList.add('submitting');
            }

            try {
                // For Google Forms, we need to use no-cors mode due to CORS restrictions
                const response = await fetch(webAppUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                // Since we can't get a response with no-cors, we'll assume success
                // and provide user feedback
                if (this.submitBtn) {
                    this.submitBtn.classList.remove('submitting');
                    this.submitBtn.classList.add('submitted');
                    this.submitBtn.textContent = "Submitted!";
                }

                // Close form after short delay
                setTimeout(() => {
                    closeForm();
                    this.resetForm();
                }, 2000);

            } catch (error) {
                console.error('Form submission error:', error);

                if (this.submitBtn) {
                    this.submitBtn.classList.remove('submitting');
                    this.submitBtn.classList.add('error');
                    this.submitBtn.textContent = "Error - Try Again";
                }

                // Reset button after delay
                setTimeout(() => {
                    if (this.submitBtn) {
                        this.submitBtn.disabled = false;
                        this.submitBtn.textContent = "Submit";
                        this.submitBtn.classList.remove('error', 'submitted');
                    }
                }, 3000);
            }
        }

        resetForm() {
            // Reset to first step
            this.currentStepIndex = 0;
            this.updateDisplay();

            // Clear form data
            this.form.reset();

            // Clear validation states
            this.form.querySelectorAll('.invalid').forEach(el => {
                el.classList.remove('invalid');
            });

            // Reset submit button
            if (this.submitBtn) {
                this.submitBtn.disabled = false;
                this.submitBtn.textContent = "Submit";
                this.submitBtn.classList.remove('submitting', 'submitted', 'error');
            }
        }
    }
});
