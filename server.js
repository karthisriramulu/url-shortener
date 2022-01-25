const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/urlShorter', {
    useNewUrlParser: true, useUnifiedTopology: true
});

const ShortUrl = require('./models/shortUrl');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find();
    res.render('index', { shortUrls: shortUrls, domain: req.get('host') });
});

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({full: req.body.fullUrl});

    res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
 const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
 if(shortUrl == null) return res.sendStatus(404);

 // add clicks
 shortUrl.clicks++;
 shortUrl.save();

 //redirect
 res.redirect(shortUrl.full);
});


app.listen(process.env.PORT || 5000);