var inquirer = require('inquirer');
fs = require('fs');

var args = process.argv.slice(2);

var oldNamespace = args[0];
var newNamespace = args[1];

var namespaces = [
    {old: oldNamespace, new: newNamespace},
    {old: 'Tx_Extbase', new: 'TYPO3\\CMS\\Extbase'}
];

var folder = args[2];

var walk = require('walk');

console.log('Namespace:' + oldNamespace + ' ~~> ' + newNamespace);

getFiles(function (files) {
    console.log('Folder: "' + folder + '" ( ' + files.length + ' PHP files)');
    console.log();
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'proceed',
            message: 'U sure bro? (' + files.length + ' PHP files will be affected)'
        }
    ]).then(function (answers) {
        if (answers.proceed) {
            run(files);
        }
    });

});

function run(files) {
    for (var i in files) {

        replaceInFile(files[i], function (filePath, content) {
            writeFile(filePath, content);
        });
    }
}

function writeFile(filePath, newContent) {
    fs.writeFile(filePath, newContent, function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("Namespaced: " + filePath);
    });
}

function replaceInFile(file, callback) {
    fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            }

            if (!data) {
                console.error('Hello there');
                process.exit();
            }

            var content = replaceContent(data);

            var filePathInFolder = file.replace(folder, '');
            var parts = filePathInFolder.split(/\\|\//).filter(function (value) {
                return value;
            });

            parts.pop();

            var namespace = namespaces[0].new + '\\' + parts.join('\\');

            content = content.replace('<?php', '<?php\r\nnamespace ' + namespace + ';');
            content = content.replace('class \\' + namespace + '\\', 'class ');

            callback(file, content);
        }
    );
}

function replaceContent(content) {
    for (var i in namespaces) {
        content = replaceNameSpaceInContent(namespaces[i], content);
    }

    return content;
}

function replaceNameSpaceInContent(namespace, content) {
    var oldPattern = namespace.old + '(_[a-zA-Z0-9]*)+';
    var re = new RegExp(oldPattern, 'g');

    return content.replace(re, function (match, content, offset) {
        return match.replace(namespace.old, '\\' + namespace.new).replace(/_/g, '\\');
    });
}


function getFiles(callback) {
    var files = [];
    var walker = walk.walk(folder, {followLinks: false});

    walker.on('file', function (root, stat, next) {
        if (stat.name.endsWith('.php')) {
            files.push(root + '/' + stat.name);
        }

        next();
    });

    walker.on('end', function () {
        if (files.length == 0) {
            console.error('No PHP files found.');
            process.exit();
        }

        callback(files);
    });
}