const container = document.querySelector(".container");
const overlay = document.querySelector(".overlay");
const overlayImg = document.querySelector(".overlayImg");
// Last img element, used to detect whether new images should be loaded
let lastElement = container.querySelector(".img:last-of-type");
const config = { headers: { "x-api-key": "live_HduPUqcQvrEMIp0NH8hzwo9Ocm3VoA72ghvJypXkkmYSB3PokxzDUdqmQYsNNq8T" } };

const init = async () => {
	const imgs = document.querySelectorAll(".mainImg");
	const imgSources = await getRandomImages(imgs.length);
	imgs.forEach((img, id) => {
		img.src = imgSources[id];
		img.classList.remove("hidden");
		unwrapImage(img);
	});
	window.addEventListener("scroll", addItemsOnScroll);
	container.addEventListener("click", (e) => {
		if (e.target.classList.contains("mainImg")) {
			const element = e.target;
			setOverlayImageSource(element.src);
			switchOverlayVisibility();
		}
	});
	overlay.addEventListener("click", (e) => {
		if (!e.target.classList.contains("overlayImg")) {
			switchOverlayVisibility();
		}
	});
};

init();

const switchOverlayVisibility = () => {
	overlay.classList.toggle("hidden");
};

const setOverlayImageSource = (src) => {
	overlayImg.src = src;
};

const unwrapImage = (image) => {
	image.parentElement.remove();
	container.append(image);
};

async function getRandomImages(amount) {
	try {
		const res = await axios.get(`https://api.thecatapi.com/v1/images/search?limit=${amount}`, config);
		return res.data.map((element) => element.url);
	} catch (e) {
		console.log("Error: ", e);
	}
}

const createImg = () => {
	const img = document.createElement("img");
	img.classList.add("img", "mainImg", "hidden");
	img.setAttribute("loading", "lazy");
	img.alt = "loading cat image";
	return img;
};

createSkeleton = () => {
	const skeleton = document.createElement("div");
	skeleton.classList.add("skeleton");
	return skeleton;
};

const addImgs = async (amount) => {
	const imgs = [];
	for (let i = 0; i < amount; i++) {
		const img = createImg();
		imgs.push(img);
		const skeleton = createSkeleton();
		skeleton.append(img);
		container.append(skeleton);
	}
	const sources = await getRandomImages(amount);
	imgs.forEach((img, id) => {
		img.src = sources[id];
		img.alt = "Random cat image";
		img.classList.remove("hidden");
		unwrapImage(img);
	});
};

function addItemsOnScroll() {
	if (isInViewport(lastElement)) {
		createElements();
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
	lastElement = container.querySelector(".mainImg:last-child");
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
