import path from 'path';
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// import * as dotenv from 'dotenv';

// if (process.env.NODE_ENV !== 'production') {
// 	dotenv.config({ path: path.resolve(__dirname, '.env') });
// }
import express from 'express';
const app = express();
import expressLayouts from 'express-ejs-layouts';

import router from './routes/index.js';

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'public')))

// Mongoose
import mongoose from 'mongoose';
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.use('/', router);

app.listen(process.env.PORT || 3000);
