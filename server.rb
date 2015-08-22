require "sinatra"
require "linkedin_scraper"
require "haml"
require "pdfkit"
require "pry"
require 'tilt/haml'

get "/" do
  haml :index
end

get '/preview/:username' do
  @username = params[:username]
  @resume = Linkedin::Profile.get_profile("http://www.linkedin.com/in/#{@username}")
  @preview = true
  haml :resume
end

post '/render/:username' do
  @username = params[:username]
  @resume = Linkedin::Profile.get_profile("http://www.linkedin.com/in/#{@username}")
  @extras = params[:extras]
  @preview = false

  response.headers['Content-Type'] = 'application/pdf'

  kit = PDFKit.new(haml(:resume))
  kit.stylesheets << File.open(settings.public_folder.to_s + '/style.css')
  kit.stylesheets << File.open(settings.public_folder.to_s + '/fonts.css')
  kit.to_pdf
end
