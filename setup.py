from setuptools import setup, find_packages

setup(
    name="manga-reader",
    description="Local web based manga reader.",
    keywords="manga reader",
    version="0.1dev0",
    author="Thomas Cairns",
    url="https://github.com/CairX/manga-reader",

    packages=find_packages(),
    package_data={"manga-reader": ["data/*"]},
    include_package_data=True,

    entry_points={
        "console_scripts": [
            "manga-reader=manga_reader:main",
        ]
    },

    classifiers=[
        "Development Status :: 1 - Planning",
        "Environment :: Console",
        "Natural Language :: English",
        "Programming Language :: Python :: 3.4",
        "Topic :: Software Development :: Documentation",
    ]
)
