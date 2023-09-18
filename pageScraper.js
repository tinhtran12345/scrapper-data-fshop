const fs = require("fs");
const pageScraperCategory = async (url, browser) => {
    let page = await browser.newPage();
    console.log(`Navigating to ${url}...`);
    // Navigate to the selected page
    await page.goto(url);
    // Wait for the required DOM to be rendered
    await page.waitForSelector(" header.fs-header ");
    // Get the link to all the required books

    let category_data = await page.$$eval(
        "nav.fs-menu >.f-wrap > ul > li ",
        (items) => {
            const data = items.map((item, index) => {
                const link = item.querySelector("a").href;
                const name = item
                    .querySelector("a")
                    .textContent.split("\n")[1]
                    .trim();

                return {
                    id: index,
                    link: link,
                    name: name,
                };
            });
            return data;
        }
    );

    for (let i = 0; i < 3; i++) {
        let element = category_data[i];
        const data_brands = async (element) => {
            let newPage = await browser.newPage();
            console.log(`Navigating to ${element.link}...`);
            // Navigate to the selected page
            await newPage.goto(element.link);
            // Wait for the required DOM to be rendered
            await newPage.waitForSelector("main .row.fspdbox");

            let brands = await newPage.$$eval(
                ".swiper-wrapper>div",
                (items) => {
                    const brand = items.map((item) => {
                        const content = item.querySelector("a > img").alt;
                        return content;
                    });
                    return brand;
                }
            );
            return brands;
        };

        let brands = await data_brands(element);
        category_data[i].brands = brands;
    }

    const data = JSON.stringify(category_data);
    fs.writeFile("data_cate.json", data, (error) => {
        // throwing the error
        // in case of a writing problem
        if (error) {
            // logging the error
            console.error(error);

            throw error;
        }

        console.log("data_cate.json written correctly");
    });
};

const pageScraperProducts = async (url, browser) => {
    let page = await browser.newPage();
    console.log(`Navigating to ${url}...`);
    // Navigate to the selected page
    await page.goto(url);
    // Wait for the required DOM to be rendered
    await page.waitForSelector(
        "main .category-container .row.fspdbox .col-9 .card.fplistbox"
    );

    let products_links = await page.$$eval(
        ".card-body .cdt-product-wrapper> .cdt-product",
        (items) => {
            const links = items.map((item) => {
                const link = item.querySelector(".cdt-product__img > a").href;
                return link;
            });
            return links;
        }
    );

    let products = [];

    for (let i = 0; i < products_links.length; i++) {
        // if (i === 5 || i === 6 || i === 7 || i == 14 || i === 15) {
        //     continue;
        // }
        const link = products_links[i];
        const getProducts = async (link) => {
            let newPage = await browser.newPage();
            console.log(`Navigating to ${link}...`);
            // Navigate to the selected page
            await newPage.goto(link);
            // Wait for the required DOM to be rendered
            await newPage.waitForSelector("main.l-main .l-pd");

            let title = await newPage.$eval(".l-pd-top > h1", (item) => {
                const title = item.textContent;
                return title;
            });
            let brand = title.split(" ")[0];
            let evaluate = await newPage.$eval(
                ".l-pd-top > .st-rating a#re-rate",
                (item) => {
                    const evaluate = item.textContent;
                    return evaluate;
                }
            );
            let images = await newPage.$$eval(
                ".l-pd-row.clearfix .swiper-container .swiper-wrapper > div",
                (items) => {
                    const imgs = items.map((item) => {
                        const img = item.querySelector("img").src;
                        return img;
                    });
                    return imgs;
                }
            );
            let colors = await newPage.$$eval(
                ".l-pd-row.clearfix .l-pd-right .st-select-color .st-select-color__item ",
                (items) => {
                    const color = items.map((item) => {
                        const image = item.querySelector(".img > img").src;
                        const label = item.querySelector("p").textContent;
                        return {
                            label,
                            image,
                        };
                    });
                    return color;
                }
            );
            let specifications = await newPage.$$eval(
                ".l-pd-row.clearfix .l-pd-left .st-param ul > li",
                (items) => {
                    const specification = items.map((item) => {
                        const data_info = item.querySelector("p").textContent;
                        const data_icon = item.querySelector("span").className;
                        return {
                            data_icon,
                            data_info,
                        };
                    });
                    return specification;
                }
            );

            let price = await newPage.$eval(
                ".l-pd-row.clearfix .l-pd-right .st-price .st-price-main",
                (item) => {
                    const price = item.textContent;
                    return price;
                }
            );
            let description = await newPage.$eval(
                ".card-body .st-pd-content p ",
                (item) => {
                    const content = item.textContent;
                    return content;
                }
            );
            let features_imgs = await newPage.$$eval(
                ".card-body .st-pd__slider .swiper-wrapper .swiper-slide ",
                (items) => {
                    const features_img = items.map((item) => {
                        const img = item.querySelector("img").src;
                        return img;
                    });
                    return features_img;
                }
            );
            let reviews = await newPage.$$eval(
                "#root-review .fpt-comment .card-body .user-content .user-wrapper .user-block",
                (items) => {
                    const contents = items.map((item, index) => {
                        const username =
                            item.querySelector(
                                ".avatar-info .text"
                            ).textContent;
                        const comment = item.querySelector(
                            ".avatar-info .avatar-para .text"
                        ).textContent;

                        return {
                            id: index + 1,
                            username,
                            rating: 5,
                            comment,
                        };
                    });
                    return contents;
                }
            );

            return {
                brand,
                title,
                evaluate,
                images,
                colors,
                price,
                specifications,
                features_imgs,
                description,
                reviews,
            };
        };
        const data = await getProducts(link);

        products[i] = {
            id: i + 1,
            ...data,
        };
    }

    const products_data = JSON.stringify(products);
    fs.writeFile("products_data3.json", products_data, (error) => {
        // throwing the error
        // in case of a writing problem
        if (error) {
            // logging the error
            console.error(error);

            throw error;
        }

        console.log("products_data3.json written correctly");
    });
};

module.exports = { pageScraperCategory, pageScraperProducts };

// output1: [id: 1, link: "http:asdhak", title: "kjhadsk", brand: ['item1', 'item2'] ]

// output2: [ title, brand, image, price, color:[], Specifications:{}, descriptions:string, reviews:{ username, rating }]
