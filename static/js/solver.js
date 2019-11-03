let setIntervalId; // Id for clearInterval to stop querying the server when done
let responseFirst; // First response text received from the server i.e file and column info
let progressList = document.getElementById('progressList'); // progressList contains progress messages
let progressBar = document.getElementById('progressBar'); // File upload progress
let progressBarOverall = document.getElementById('progressBarOverall'); // Overall progress
let progressContainer = document.querySelector('.progressContainer'); //Outer progress Container
let uploadInfo = document.getElementById('uploadInfo'); // Contains text + file upload progress bar
let fewQuestionsContainer = document.querySelector('.fewQuestionsContainer'); // Few Questions container
let uploadInstr = document.getElementById('uploadInstr'); // Contains 2 <p> tags with instructions for upload
let dropArea = document.querySelector('.uploadContainer'); // The file drop area

// Hide the few questions and uploadInfo (contains your file is uploading... message) containers until the file upload Starts  
fewQuestionsContainer.style.display = 'none';
uploadInfo.style.display = 'none';

// *** File upload stuff starts here ***

// Function to prevent default behaviour
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Function to highlight the dropArea on object drag
function highlight(e) {
    dropArea.classList.add('highlight')
}

// Function to un highlight the dropArea 
function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

// Function to handle drop
function handleDrop(e) {
    let dt = e.dataTransfer
    let file = dt.files[0]
    uploadFile(file)
}

// For all these prevent default behavior
let allEvents = ['dragenter', 'dragover', 'dragleave', 'drop'];
allEvents.forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
});

// For these events hightlight the drop area
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
});

// For these events undo the hightlight (unHighlight)
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
});

// When the file is dropped, run handleDrop
dropArea.addEventListener('drop', handleDrop, false)

// *** File upload stuff ends here ***


// This function does the actual file upload task 
function uploadFile(file) {
    // Show the uploadInfo with progress bar and hide uploadInstr after file drop
    uploadInfo.style.display = 'block';
    uploadInstr.style.display = 'none';

    // Drag the progress bar to 60% after 1 second
    setTimeout(() => {
        progressBar.style.width = '60%';
    }, 1000);

    // Upload the file using Ajax request
    var url = 'upload';
    var xhr = new XMLHttpRequest();
    var formData = new FormData();
    xhr.open('POST', url, true);
    xhr.addEventListener('readystatechange', function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Request has returned response. Show the fewQuestions container
            fewQuestionsContainer.style.display = 'block';

            // Grab the response text after file upload and parse it as json. It contains filename and columns
            responseFirst = JSON.parse(xhr.responseText);

            //Initialize a counter for labeling question Serial Nos
            let i = 1;

            // Generate the first question: Do you want profiling or Best ML Algo search?
            str = `<div class="row">
                        <div class="col-md-4">
                        ${i}. What are you interested in? 
                        </div>
                        <div class="col-md-6">
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="whattodo" id="radioml" value="ml" checked>
                                <label class="form-check-label" for="radioml">Find the Best ML Algorithm</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="whattodo" id="radioprofile" value="profile" >
                                <label class="form-check-label" for="radioprofile">Generate Report my data</label>
                            </div>                                    
                        </div>
                    </div>`;

            // Loop over to ask questions about all the columns
            for (item of responseFirst.columns) {
                i++;
                str += ` <div class="row">
                                <div class="col-md-4">
                                ${i}. What type of attribute is ${item}?
                                </div>
                                <div class="col-md-6">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="${item}" id="${item}radio1" value="cat">
                                        <label class="form-check-label" for="${item}radio1">Categorical</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="${item}" id="${item}radio2" value="num" checked>
                                        <label class="form-check-label" for="${item}radio2">Numerical</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="${item}" id="${item}radio3" value="text">
                                        <label class="form-check-label" for="${item}radio3">Text</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="${item}" id="${item}radio4" value="skip">
                                        <label class="form-check-label" for="${item}radio4">Skip This Attribute</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="${item}" id="${item}radio5" value="label">
                                        <label class="form-check-label" for="${item}radio5">Label</label>
                                    </div>                                
                                </div>
                        </div>`;
            }

            // Insert these questions inside the 'questions' div inside the 'fewQuestions' Container
            questions = document.getElementById('questions');
            questions.innerHTML = str;

            // Log the success and the response text from the server after file upload
            console.log('Successfully uploaded file to the server!', responseFirst);

            // Run the file upload progress bar to 100% gradually
            progressBar.style.width = '70%';
            setTimeout(() => {
                progressBar.style.width = '100%';
                uploadInfo.innerHTML = `<h3>Your file has been uploaded for analysis!</h3>`;
                document.querySelector('.uploadImage').src = '/static/img/uploaderGear.svg'
            }, 1000);
        }
        else if (xhr.readyState == 4 && xhr.status != 200) {
            // If something goes wrong report it to the UI and log the error to the console
            console.log('Error');
            uploadInfo.innerHTML = `<h3>Some error occured while uploading your file</h3>`;
        }
    })

    // Prepare and send the XHR request
    formData.append('uploadType', 'def');
    formData.append('uploadKey', 'def');
    formData.append('fileToUpload', file);
    formData.append('csrfmiddlewaretoken', csrf_token);
    xhr.send(formData);
}

let submit = document.getElementById('submit'); // The submit button inside the fewQuestions container

// When the submit button is clicked, prepare an object with user answers to be sent to the server
submit.addEventListener('click', () => {
    let fewAnswers = { "filename": responseFirst.name }; // Add the filename to the fewAnswers

    // For all the columns get the attribute as given by the user
    for (col of responseFirst.columns) {
        let val = document.querySelector(`input[name="${col}"]:checked`).value;
        fewAnswers[col] = val;
    }

    // Log the answers provided by the user to the console
    console.log('Following answers were provided by the user', fewAnswers);

    // Trigger the process with the fewAnswers object contaning the csv file and columns data
    triggerProcess(fewAnswers);

    // Show the overall progress container and hide the fewQuestions container
    progressContainer.style.display = 'block';
    fewQuestionsContainer.style.display = 'none';

    // Tell the user that his file is being analyzed
    uploadInfo.innerHTML = `<h3>Your file is being analyzed!</h3>`;

    // Pull progress from the server every 5 seconds
    setIntervalId = setInterval(() => {
        pullProgress();
    }, 5000);
});


// This function triggers the process for the file and attributes in fewAnswers object
function triggerProcess(fewAnswers) {
    // Send a post request for triggering process on the server
    fetch('trigger', {
        method: 'POST',
        headers: {
            "X-CSRFToken": csrf_token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(fewAnswers),
        credentials: 'same-origin'
    }).then(res => res.text())
        .then(res => console.log(res)); // Log the response as it is to the console
}

// This function pulls progress from the database and then runs updateProgressDom function
function pullProgress() {
    let resp;
    file = responseFirst.name;
    fetch('pullprogress', {
        method: 'POST',
        headers: {
            "X-CSRFToken": csrf_token,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 'file': file }),
        credentials: 'same-origin'
    }).then(res => res.text())
        .then((res) => {
            resp = res;
            updateProgressDom(resp);
        });
}

// Function to update the Dom given the array of messages received from the server
function updateProgressDom(resp) {
    resp = JSON.parse(resp) // Parse the response string as json
    let str = ""; // Initialize a blank string

    // For each message in the response, create a list item to be appended to the overall progress container
    resp.forEach((item) => {
        str += `<li class="list-group-item d-flex justify-content-between align-items-center">
            ${item}
            <span class="badge badge-success badge-pill">&#10004;</span>
           </li>`;
    });

    // Append the generated HTML to the progressList
    progressList.innerHTML = str;

    // Update the overall progress bar
    progressBarOverall.style.width = Math.floor(resp.length * 3) + '%';

    // If all the work is done, run clearInterval using interval id to stop browser from sending reqeusts every 5 seconds
    if (resp.length == 30) {
        clearInterval(setIntervalId); // Stop the called setInterval 
        progressBarOverall.style.width = '100%' // Set progress to 100%
        uploadInfo.innerHTML = `<h3>Your file has been analyzed!</h3>`; // Update the uploadInfo container
    }
}