/* Javascript for ImagesGalleryXBlock. */
function ImagesGalleryXBlock(runtime, element) {

    const fileUploadHandler = runtime.handlerUrl(element, 'file_upload');

    $(element)
    .find("#file-upload-submit")
    .on('click', function() {
        console.log("File upload button clicked");
        fileUpload();
    });

    function fileUpload() {
        var fileInput = document.getElementById('file-upload');
        var file = fileInput.files[0];
        var formData = new FormData();
        formData.append('file', file);
        $.ajax({
            url: fileUploadHandler,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                console.log(data);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
}
