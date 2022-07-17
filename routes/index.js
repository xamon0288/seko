import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
	res.render('index');
});

router.get('/random', (req, res) => {
	res.render('random');
});

router.get('/categories', (req, res) => {
	res.render('categories');
});

router.get('/category', (req, res) => {
	res.render('category');
});

router.get('/favorites', (req, res) => {
	res.render('favorites');
});

router.post('/favorites', (req, res) => {
	res.render('favorites');
});

router.get('/favorite', (req, res) => {
	res.render('favorite');
});

export default router;
