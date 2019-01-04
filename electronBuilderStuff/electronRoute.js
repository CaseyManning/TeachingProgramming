//Install page for Electron Application
router.get('/electron', function(req, res, next){
    electronBuilder()
        .then(e => fs.readFile(e.filePath, (err, data) => {
            res.setHeader('Content-Disposition', `attachment; filename="${e.fileName}"`);
            res.setHeader('Content-type', e.mimeType);
            res.send(data);
        })).catch((error) => {
            console.error(error);
        });
});
