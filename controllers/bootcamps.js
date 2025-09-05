exports.getBootcamps = async (req, res, next) => {
    // take the request

    // intiate service call

    //send the response
    return res.status(200).json({ success: true });

}
exports.createBootCamp = async (req, res, next) => {
        const bootCamp = await BootCamp.create(req.body);
        return res.status(201).json(
            { 
                success: true,
                data: bootCamp 
            }
        );

}


exports.getBootcamp = async (req, res, next) => {
    return res.status(200).json({ success: true });

}

exports.updateBootCamp = async (req, res, next) => {
    return res.status(200).json({ success: true });

}

exports.deleteBootcamp = async (req, res, next) => {
    return res.status(200).json({ success: true });

}



