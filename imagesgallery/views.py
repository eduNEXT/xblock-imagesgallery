from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
import os

@csrf_exempt  # You may need to exempt CSRF protection depending on your use case
def get_jsfile(request, filename):
    # Define the path to the directory containing your JavaScript files
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    jsfiles_directory = os.path.join(BASE_DIR, 'imagesgallery/static/html')  # Update this path as needed

    # Construct the full path to the requested JavaScript file
    file_path = os.path.join(jsfiles_directory, filename)

    try:
        # Open the file and read its content
        with open(file_path, 'rb') as js_file:
            content = js_file.read()

        # Create an HttpResponse with the JavaScript content and content type
        response = HttpResponse(content, content_type='application/javascript')
        return response
    except FileNotFoundError:
        # Handle file not found error
        return HttpResponse(status=404)


def my_view(request):
    # Your view logic here
    context = {
        'route': 'your_route_data_here',
    }
    return render(request, 'my_template.html', context)



