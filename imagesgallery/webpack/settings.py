import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


WEBPACK_LOADER = {
    'my_custom_loader': {
        'BUNDLE_DIR_NAME': 'imagesgallery/static/html/',  # Relative path to the bundle directory
        'STATS_FILE': os.path.join(BASE_DIR, 'imagesgallery/static/html', 'webpack-stats-test.json'),  # Path to webpack-stats.json file
    }
}
