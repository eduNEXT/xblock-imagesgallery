/* Javascript for ImagesGalleryXBlock. */
function ImagesGalleryXBlock(runtime, element) {

    const fileUploadHandler = runtime.handlerUrl(element, 'file_upload');
    console.log(element);
    $(element)
    .find("#file-upload")
    .on("submit", function(e) {
        e.preventDefault();
        console.log("File upload button clicked");
        var formData = new FormData(this);
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
    });
}
