const container = document.querySelector(".container");
// Last img element, used to detect whether new images should be loaded
let lastElement = container.querySelector(".img:last-of-type");
const config = { headers: { "x-api-key": "live_HduPUqcQvrEMIp0NH8hzwo9Ocm3VoA72ghvJypXkkmYSB3PokxzDUdqmQYsNNq8T" } };

const init = async () => {
	const imgs = document.querySelectorAll("img");
	console.log(imgs);
	const imgSources = await getRandomImages(imgs.length);
	imgs.forEach((img, id) => {
		img.src = imgSources[id];
		img.classList.remove("skeleton");
	});
	window.addEventListener("scroll", addItemsOnScroll);
};

init();

async function getRandomImages(amount) {
	try {
		const res = await axios.get(`https://api.thecatapi.com/v1/images/search?limit=${amount}`, config);
		return res.data.map((element) => element.url);
	} catch (e) {
		console.log("Error ", e);
	}
}

const createImg = () => {
	const img = document.createElement("img");
	img.classList.add("img", "skeleton");
	img.src = "";
	return img;
};

const addImgs = async (amount) => {
	const skeletons = [];
	for (let i = 0; i < amount; i++) {
		skeletons.push(createImg());
	}
	container.append(...skeletons);
	const sources = await getRandomImages(amount);
	skeletons.forEach((skeleton, id) => {
		skeleton.src = sources[id];
		skeleton.classList.remove("skeleton");
	});
};

function addItemsOnScroll() {
	if (isInViewport(lastElement)) {
		console.log("yes");
		createElements();
	} else {
		console.log("no");
	}
}

const createElements = () => {
	window.removeEventListener("scroll", addItemsOnScroll);
	addImgs(18).then(() => {
		changeLastElement(lastElement);
		if (isInViewport(lastElement)) {
			createElements();
		} else {
			window.addEventListener("scroll", addItemsOnScroll);
		}
	});
};

/*
	Removes last element temporarily to prevent more elements to be added to the DOM
	after scrolling during the fetch phase. Another function updates the last element
	after adding new elements to the DOM.
*/
const removeLastElement = () => {
	lastElement = null;
};

/*
	Changes last element variable to last image element, used to load new content
*/
const changeLastElement = () => {
	lastElement = container.querySelector(".img:last-child");
};

/* 
	Checks whether the last image element is currently visible for the user
*/
const isInViewport = (element) => {
	if (element) {
		const rect = element.getBoundingClientRect();
		return rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
	}
};
