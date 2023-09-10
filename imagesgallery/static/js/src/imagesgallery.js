/* Javascript for ImagesGalleryXBlock. */
function ImagesGalleryXBlock(runtime, element) {

    const fileUploadHandler = runtime.handlerUrl(element, 'file_upload');
    const fileGetterHandler = runtime.handlerUrl(element, 'get_files');

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

    $(element).find(`#get-assets`).click(function () {
        const data = {
            "current_page": 0,
            "page_size": 10,
        }
        $.post(fileGetterHandler, JSON.stringify(data))
        .done(function (response) {
            console.log(response.files);
        })
        .fail(function () {
            console.log("Error getting assets");
        });
    });
}
