/** For debugging/testing */
export function CircleBufferAppender() {
    this.setBufferSize(0);
}

CircleBufferAppender.prototype = new log4javascript.Appender();
CircleBufferAppender.prototype.layout = new log4javascript.SimpleLayout();
CircleBufferAppender.prototype.threshold = log4javascript.Level.DEBUG;


//Clears the buffer and sets the size.
CircleBufferAppender.prototype.setBufferSize = function(size) {

    if (typeof size !== 'number') {
        throw 'Expecting a number! >> Cannot set buffersize with an argument of type: ' + typeof size;
    }

    // 0 means in essence not to capture!
    if (size < 0) {
        size = 0;
    }

    this.bufferSize = size;
    this.buffer = [];
    this.nextMessageIndex = 0;
};

/** Returns the buffer from oldest to newest... */
CircleBufferAppender.prototype.getCircleBuffer = function() {

    var returnBuffer = [];

    //EMPTY...
    if (this.buffer.length === 0) {
        return returnBuffer;
    }

    var terminalIndex = this.nextMessageIndex - 1;
    if (terminalIndex < 0) {
        terminalIndex = this.bufferSize - 1;
    }

    //The oldest message is by definition the next (existing) message
    var tempIndex = this.nextMessageIndex;

    while (tempIndex !== terminalIndex) {
        if (this.buffer.length > tempIndex) {
            returnBuffer.push(this.buffer[tempIndex]);
        }
        tempIndex++;
        if (tempIndex >= this.bufferSize) {
            tempIndex = 0;
        }
    }

    if (this.buffer.length > tempIndex) {
        returnBuffer.push(this.buffer[tempIndex]);
    }

    return returnBuffer;
};


CircleBufferAppender.prototype.append = function(loggingEvent) {
    if (this.bufferSize === 0) {
        return;
    }
    var appender = this;

    var getFormattedMessage = function() {
        return appender.getLayout().formatWithException(loggingEvent);
    };

    var formattedMessage = getFormattedMessage();

    var bufferEntry = {level: loggingEvent.level.name, message: formattedMessage};
    if (this.nextMessageIndex === this.buffer.length) {
        this.buffer.push(bufferEntry);
    }
    else {
        //Start replacing the circle...
        this.buffer[this.nextMessageIndex] = bufferEntry;
    }
    this.nextMessageIndex++;
    if (this.nextMessageIndex >= this.bufferSize) {
        this.nextMessageIndex = 0;
    }
};
