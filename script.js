async function handleFileUpload(event) {
    event.preventDefault();  // Prevent the form from submitting and refreshing the page

    const files = document.getElementById('fileInput').files; // Get selected files
    const formData = new FormData();

    // Append each file to the FormData object
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }

    try {
        // Show loading spinner
        document.getElementById('loading').style.display = 'block';

        // Send files to the backend
        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,  // Attach the FormData object with the files
        });

        // Log the response from the server
        const data = await response.json();
        console.log('Server Response:', data);

        // Hide loading spinner
        document.getElementById('loading').style.display = 'none';

        if (response.ok) {
            alert('Files uploaded successfully!');
            displayUploadedFiles(data.files); // Display uploaded files
            document.getElementById('uploadForm').reset(); // Reset the form
        } else {
            alert(`Upload failed: ${data.message}`);
        }
    } catch (error) {
        console.error('Error uploading files:', error);

        // Display error message
        const errorContainer = document.getElementById('errorContainer');
        errorContainer.innerText = 'An error occurred while uploading files.';
    } finally {
        // Ensure loading spinner is hidden even if the request fails
        document.getElementById('loading').style.display = 'none';
    }
}

// Function to display uploaded files (you can update the UI with this data)
function displayUploadedFiles(files) {
    const uploadedFilesContainer = document.getElementById('uploadedFiles');
    uploadedFilesContainer.innerHTML = ''; // Clear previous uploads

    files.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file';
        fileElement.innerHTML = `
            <p><strong>File Name:</strong> ${file.originalName}</p>
            <p><strong>File Path:</strong> <a href="${file.filePath}" target="_blank">${file.filePath}</a></p>
        `;
        uploadedFilesContainer.appendChild(fileElement);
    });
}
