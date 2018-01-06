module.exports = {

    'GOOGLE_CLIENT_ID': '743616352844-rfifphgd676dh83d1n251jqqv24gmm77.apps.googleusercontent.com', // id naszej apki, apka to client
    'GOOGLE_CLIENT_SECRET': 'fg66hvBfF1JRdHSB-LsEA4u9', // kod uwierzytelniajacy apkę
    'CALLBACK_URL': 'http://localhost:3000/auth/google/callback' 
//  sciezka do ktorej beda przekierowani userzy po ich uwierzytelnieniu i zgodzie na nasze żadanie dostepu. W tym przekierowaniu(w httpsie) zawarty jest również 
// Authorization Code dla apki, który może ona wraz z client id i secretem wymienić w Authorization Server na access token.
};


