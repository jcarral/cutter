Node.js: cutter
=================

Installation
------------

    npm install -g cutter-files

Usage
-----

Cutter is a cli tool to split files. It can be done by defining the number of lines by file or the number of files you expect.

Split MyFile in files of 100 lines
```
cutter -i MyFile -s 100
```

Split MyFile in 100 files
```
cutter -i MyFile -f 100
```

License
-------

Licensed under MIT
Copyright (c) 2021 [Joseba Carral](https://github.com/jcarral)
