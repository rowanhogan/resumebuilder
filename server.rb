require 'rubygems'
require 'sinatra'
require "haml"
require "linkedin_scraper"
require "pdfkit"
require 'tilt/haml'

get "/" do
  haml :index
end

get '/preview/:username' do
  @username = params[:username]
  @resume = ::Linkedin::Profile.get_profile("http://www.linkedin.com/in/#{@username}")

  if @resume
    @preview = true
    haml :resume
  else
    redirect '/'
  end
end

post '/render/:username' do
  @username = params[:username]
  @resume = ::Linkedin::Profile.get_profile("http://www.linkedin.com/in/#{@username}")
  @extras = params[:extras]

  if @resume
    @preview = false
    response.headers['Content-Type'] = 'application/pdf'

    kit = PDFKit.new(haml(:resume))
    kit.stylesheets << File.open(settings.public_folder.to_s + '/style.css')
    kit.stylesheets << File.open(settings.public_folder.to_s + '/fonts.css')
    kit.to_pdf
  else
    redirect '/'
  end
end
