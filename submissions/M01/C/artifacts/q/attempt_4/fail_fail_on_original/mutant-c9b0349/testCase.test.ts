function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);
    if (!fileNameAndLineNumber) return false;
    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];
    return true &&   // mutant: was lineNumber >= qStartingLine &&
        fileName === qFileName &&
        lineNumber <= qEndingLine;
}