// ===================================
// Admission Form Document Upload
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    const admissionForm = document.getElementById('admissionForm');
    
    if (!admissionForm) return;
    
    // Setup file previews for each document
    setupFilePreview('birthCertificate', 'birthCertPreview');
    setupFilePreview('kcpeResults', 'kcpeResultsPreview');
    setupFilePreview('passportPhoto', 'passportPhotoPreview');
    
    // Handle form submission
    admissionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate all documents are uploaded
        const birthCert = document.getElementById('birthCertificate').files[0];
        const kcpeResults = document.getElementById('kcpeResults').files[0];
        const passportPhoto = document.getElementById('passportPhoto').files[0];
        
        if (!birthCert) {
            showNotification('Please upload Birth Certificate', 'error');
            return;
        }
        
        if (!kcpeResults) {
            showNotification('Please upload KCPE Results', 'error');
            return;
        }
        
        if (!passportPhoto) {
            showNotification('Please upload Passport Photo', 'error');
            return;
        }
        
        // Validate file sizes (max 5MB for PDFs, 2MB for images)
        if (birthCert.size > 5 * 1024 * 1024) {
            showNotification('Birth Certificate file is too large (max 5MB)', 'error');
            return;
        }
        
        if (kcpeResults.size > 5 * 1024 * 1024) {
            showNotification('KCPE Results file is too large (max 5MB)', 'error');
            return;
        }
        
        if (passportPhoto.size > 2 * 1024 * 1024) {
            showNotification('Passport Photo file is too large (max 2MB)', 'error');
            return;
        }
        
        const acceptedDocumentTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (![birthCert, kcpeResults].every(file => acceptedDocumentTypes.includes(file.type))) {
            showNotification('Birth Certificate and KCPE Results must be PDF, JPG, or PNG files', 'error');
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(passportPhoto.type)) {
            showNotification('Passport Photo must be a JPG or PNG image', 'error');
            return;
        }

        const formData = new FormData(admissionForm);
        const submitButton = admissionForm.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        try {
            if (!window.API || !window.API.admissions) {
                throw new Error('Admission service is unavailable. Please try again later.');
            }

            const response = await window.API.admissions.submit(formData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to submit application');
            }

            showNotification(response.message || 'Application submitted successfully.', 'success');
            admissionForm.reset();
            clearAllPreviews();
        } catch (error) {
            console.error('Submission error:', error);
            showNotification(error.message || 'Failed to submit application. Please try again.', 'error');
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
});

function setupFilePreview(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (!input || !preview) return;
    
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (!file) {
            preview.innerHTML = '';
            return;
        }
        
        const fileInfo = document.createElement('div');
        const content = document.createElement('div');
        const icon = document.createElement('i');
        const details = document.createElement('div');
        const fileName = document.createElement('strong');
        const fileSize = document.createElement('span');
        const removeButton = document.createElement('button');
        const removeIcon = document.createElement('i');

        fileInfo.className = 'file-info';
        content.className = 'file-info-content';
        icon.className = `fas fa-file-${file.type === 'application/pdf' ? 'pdf' : 'image'}`;
        fileName.textContent = file.name;
        fileSize.textContent = `${(file.size / 1024).toFixed(2)} KB`;
        removeButton.type = 'button';
        removeButton.className = 'remove-file';
        removeButton.setAttribute('aria-label', `Remove ${file.name}`);
        removeIcon.className = 'fas fa-times';
        removeButton.appendChild(removeIcon);
        removeButton.addEventListener('click', () => removeFile(inputId, previewId));

        details.append(fileName, fileSize);
        content.append(icon, details, removeButton);
        fileInfo.appendChild(content);
        
        // Show image preview for passport photo
        if (file.type.startsWith('image/') && inputId === 'passportPhoto') {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgPreview = document.createElement('img');
                imgPreview.src = e.target.result;
                imgPreview.className = 'passport-preview';
                imgPreview.alt = 'Selected passport photo preview';
                imgPreview.style.maxWidth = '150px';
                imgPreview.style.maxHeight = '150px';
                imgPreview.style.borderRadius = '8px';
                imgPreview.style.marginTop = '10px';
                fileInfo.appendChild(imgPreview);
            };
            reader.readAsDataURL(file);
        }
        
        preview.replaceChildren();
        preview.appendChild(fileInfo);
    });
}

function removeFile(inputId, previewId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    
    if (input) input.value = '';
    if (preview) preview.innerHTML = '';
}

function clearAllPreviews() {
    ['birthCertPreview', 'kcpeResultsPreview', 'passportPhotoPreview'].forEach(id => {
        const preview = document.getElementById(id);
        if (preview) preview.innerHTML = '';
    });
}
