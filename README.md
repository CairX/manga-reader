# manga-reader
Read manga that you have stored on your local file system. With automatic bookmarking that will remember your last read page.

## runnig
### requirements
The application is writte for Python 3.4.

Flask, more information can be found at http://flask.pocoo.org/ . Installation of this is simply done through pip.
```
pip install flask
```
or if you distrubation has something else then Python 3.4 as default you need to run.
```
pip3.4 install flask
```

### installation
The easist way is to download a ZIP of the project which you can find out to the right here on Gihub and simply unpack it. After that you need to modify the varibles in reader.conf.

### reading
To start the application you need to run the reader.py file.
```
python reader.py
```
or if you distrubation has something else then Python 3.4 as default you need to run.
```
python3.4 reader.py
```
Now a server will start listening to port 5000. Open a browser and direct it to.
```
http://localhost:5000/
```

## keys
| Action | Keys |
|---|---|
| Next page | Right arrow, D or Space |
| Previous page | Left arrow or A |
| Toogle read mode* | R |
| Toogle between light (default) and dark theme. | T |

\* Read mode removes everything besides the page image.

## todo
* Remove Flask dependancy.
* Make the application runnable/installable.
* Make the application possible to run as a deamon for autostart.
