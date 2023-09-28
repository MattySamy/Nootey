const Note = require("../models/Notes");
const mongoose = require("mongoose");
exports.dashboard = async function(req, res) {
    const locals = {
        userName: req.user.firstName,
        title: "Dashboard",
        description: "Free Nodejs Notes Application",
    };
    let perPage = 12;
    let page = req.query.page || 1;
    try {
        // Mongoose "^7.0.0 Update
        const notes = await Note.aggregate([
                { $sort: { updatedAt: -1 } },
                { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
                {
                    $project: {
                        title: { $substr: ["$title", 0, 30] },
                        body: { $substr: ["$body", 0, 100] },
                    },
                }
            ])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Note.count();

        res.render('dashboard/index', {
            userName: req.user.firstName,
            locals,
            notes,
            layout: "../views/layouts/dashboard",
            current: page,
            pages: Math.ceil(count / perPage)
        });

        // Original Code
        // Note.aggregate([
        //   { $sort: { updatedAt: -1 } },
        //   { $match: { user: mongoose.Types.ObjectId(req.user.id) } },
        //   {
        //     $project: {
        //       title: { $substr: ["$title", 0, 30] },
        //       body: { $substr: ["$body", 0, 100] },
        //     },
        //   },
        // ])
        //   .skip(perPage * page - perPage)
        //   .limit(perPage)
        //   .exec(function (err, notes) {
        //     Note.count().exec(function (err, count) {
        //       if (err) return next(err);
        //       res.render("dashboard/index", {
        //         userName: req.user.firstName,
        //         locals,
        //         notes,
        //         layout: "../views/layouts/dashboard",
        //         current: page,
        //         pages: Math.ceil(count / perPage),
        //       });
        //     });
        //   });

    } catch (error) {
        res.status(400).render('400')
    }
};

exports.dashboardViewNote = async(req, res) => {
    const note = await Note.findById({ _id: req.params.id }).where({ user: req.user.id }).lean();

    if (note) {
        res.render('dashboard/view-note', {
            title: `Note - ${note.title}`,
            description: "Free Nodejs Notes Application",
            noteID: req.params.id,
            note,
            layout: '../views/layouts/dashboard',
        });
    } else {
        res.status(400).render('400')
    }
};


exports.dashboardUpdateNote = async(req, res) => {
    try {
        await Note.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now(),
        }).where({ user: req.user.id });
        res.redirect('/dashboard')
    } catch (err) {
        res.status(400).render('400')
    }
}

exports.dashboardDeleteNote = async(req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id).where({ user: req.user.id });
        res.redirect('/dashboard');
    } catch (err) {
        console.log(err);
        res.status(404).render('404')
    }
};

exports.dashboardAddNote = async(req, res) => {
    res.render('dashboard/add', {
        layout: '../views/layouts/dashboard',
        title: "Add Note",
        description: "Free Nodejs Notes Application",
    });
}

exports.dashboardAddNoteSubmit = async(req, res) => {
    try {
        req.body.user = req.user.id;
        await Note.create(req.body); // req.body => object
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
        res.status(404).render('404')
    }
};

exports.dashboardSearch = async(req, res) => {
    try {
        res.render('dashboard/search', {
            title: "Search",
            description: "Free Nodejs Notes Application",
            searchResults: '',
            layout: '../views/layouts/dashboard',
        });
    } catch (err) {
        console.log(err);
        res.status(404).render('404')
    }
}

exports.dashboardSearchSubmit = async(req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecificChars = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
        const searchResults = await Note.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecificChars, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecificChars, 'i') } }
            ]
        }).where({ user: req.user.id });
        res.render('dashboard/search', {
            title: "Search Results",
            description: "Free Nodejs Notes Application",
            searchResults,
            layout: '../views/layouts/dashboard',
        });
    } catch (err) {
        console.log(err);
        res.status(404).render('404')
    }
}