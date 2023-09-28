exports.homePage = async function(req, res) {
    const locals = {
        title: "Nootey",
        description: "Free Nodejs Notes Application",
    }
    res.render('index', { locals, layout: '../views/layouts/front-page' }); // important
}

exports.about = async function(req, res) {
    const locals = {
        title: "About - Nootey",
        description: "Free Nodejs Notes Application",
    }
    res.render('about', locals);
}

exports.faq = async function(req, res) {
    const locals = {
        title: "FAQ - Nootey",
        description: "Free Nodejs Notes Application",
    }
    res.render('faq', locals);
}

exports.features = async function(req, res) {
    const locals = {
        title: "Features - Nootey",
        description: "Free Nodejs Notes Application",
    }
    res.render('features', locals);
}