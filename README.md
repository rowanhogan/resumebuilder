
[Resume Builder](http://resumebuilder.rowanhogan.com)
-----------------------------------------------------

Build your PDF resume/CV with ease. Adds some design flair to data obtained from your Linkedin Profile, and allows you to customise the data.

### Try it yourself: [resumebuilder.rowanhogan.com](http://resumebuilder.rowanhogan.com)

This is a little AngularJS app (combined with two separate Sinatra apps, see below).

If you want to run this locally, please note that this projects depends on:

1. Linkedin scraper server (running on Openshift) - [Repo](https://github.com/rowanhogan/scraper_server)
2. PDF rendering server (running on Heroku) - [Repo](https://github.com/rowanhogan/pdf_renderer)

To run, you'll need `node`. After cloning, `npm install` and then `gulp` should get it going.
