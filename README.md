# Description

For this project I was in a group of three with Linh Vu and Joel Sahiti. We were given the task to make a full stack application. We had one week to complete this task and we decided on a vegan food reviewing website. This consisted of a register, login, products page, brands page and reviews.

# Deployment link

https://vegan-products.netlify.app

# Getting Started/Code Installation

Clone both repos locally, then open them in VS code, using:

```js
code .
```

Then:
For the backend, run:

```js
npm run dev
```

For the frontend, run:

```js
npm start
```

# Timeframe & Working Team (Solo/Pair/Group)

For this project we had one week. We started on a Tuesday and roughly aimed to have the back-end finished by the end Thursday so we had three days for the front-end and a day of styling. We managed to stick to this rough time schedule.

# Technologies Used

For the backend we used: MongoDB, mongoose, express
For the frontend we used: React.js, MUI, sass

For planning, video calls and discussions we used: Slack, Zoom, Trello, Excalidraw, Google Drive

# Brief

Our brief was to create a MERN stack application in one week using MongoDB for the back-end database and React.js for the front-end. This application had to use authentication and at least two models on the back-end with multiple components on the front-end.

# Planning

Initially we started to brainstorm on a rough idea, and as it is Veganuary we decided to create a vegan products reviewing site. This would allow users to create products and link them to brands, search products and. Review products. We decided we wanted to add a users page too, with all the users profiles which showed you their comments.

We used excalidraw to give us a basic idea of how things would be laid out on the page and it also prompted us to add in a search bar and a filter by. This was paired with some pseudocode and gave us the basic outline of how each aspect would interact with the rest of the app.

<img alt='plan of project-3' src='./ReadMe_assets/project-3 full.png'>

We chose to use Trello to organise our tasks and as a way to keep on track with what the other members in the group had completed or were working on. This was the biggest project we had done so far so we know communication between the members was key. We were also on constant zoom calls and scheduled in a stand-up at the beginning of each day to review the progress and let the members know what section you were tackling next.

We decided that everyone would do an aspect of the back-end and continue it through to the front-end so we would all be involved in the fullstack application. I was on Users, Linh did products and Joel did brands. My sections included the logging in, register, user profiles and individual profiles. I then also took on the reviews as I had completed my sections before the others. I carried these pages into the front-end design and then also did the home page and navbar on the front-end.

# Build/Code Process

I was working on the user, which was logging in, registering and the authentication process. I also did the user profiles and user index as well as edited the reviews controller and created the reviews model.
The validatePassword function comes from my user Schema where I used bcrypt to compare the hashed passwords:

```js
userSchema.pre('save', function encryptPassword(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
  }
  next();
});

userSchema.methods.validatePassword = function validatePassword(password) {
  return bcrypt.compareSync(password, this.password);
};
```

Firsty, I saved the encrypted password, this is after it has been hashed and salted, then I create the function which I go on to use in the login function on the user controller. This compares the passworded entered with the hashed password stored and allows the user to login but creating a token:

```js
const isValidPassword = user.validatePassword(req.body.password);

if (!isValidPassword) {
  return res.status(400).json({ message: 'Unauthorized' });
}

const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, SECRET, {
  expiresIn: '6h'
});
```

Once the backend functionality was completed, I moved onto the front end for the same sections, I also took on the Home page and the Navbar. For the Home page we had decided we wanted a random product from our array of products, so I used useEffect to get all the products, and then the product card to display:

```js
const [products, setProducts] = useState('');
const [randomProduct, setRandomProduct] = useState(null);
```

First I set some state.

```js
useEffect(() => {
  API.GET(API.ENDPOINTS.getAllProducts)
    .then(({ data }) => {
      setProducts(data);
      setRandomProduct(Math.floor(Math.random() * data.length));
    })
    .catch(({ message, response }) => console.error(message, response));
}, []);
```

Then I fetched the data and got a random number with the limit, the length of the array.

```js
<ProductCard
  name={products[randomProduct]?.name}
  image={products[randomProduct]?.image}
  brand={products[randomProduct]?.brand?.name}
  category={products[randomProduct]?.category.name}
  id={products[randomProduct]?._id}
  rating={products[randomProduct]?.rating || 0}
/>
```

Then I used the product card to display the product.

I also decided to include a drag and drop functionality to the profile image when you register. I did this because I thought it would make an otherwise quite bland page interesting. I researched a good npm install for drag and drop and managed to find one which was very similar in the way it was set out to what I had already coded in the register page. Firstly, I had to install react-drag-and-drop-files, then import FileUploader. Then for the file change I used this function:

```js
const handleFileChange = (file) => {
  setFile(file);
};
```

And simply filtered this into the function they gave:

```js
<FileUploader handleChange={handleFileChange} name='file' types={fileTypes} />
```

# Challenges

Initially the reviews model was incorporated into the product model. However, this did not work due to the way the models were laid out, it made it hard to access a lot of information. Due to the position I was in with my own sections, I took on the task of creating a separate reviews Schema and updating the controller.

I making the reviews Schema, its own separate model Schema, and then I began to update the reviews controller to allow for the actions to take place:

```js
async function createReview(req, res, next) {
  try {
    const newReview = await Review.create({
      ...req.body,
      reviewer: req.currentUser._id
    });

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { reviews: newReview } }
    );

    const userWithReviews = await User.findOneAndUpdate(
      { _id: req.currentUser._id },
      { $push: { reviews: newReview } }
    );

    console.log({ userWithReviews });

    return res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
}
```

Here I have created the new review, and then in turn found that review from the id on the Product or of the current user for the User. Then I updated those singular pages with the new review and returned a status code of 200, with the body of the new review.

However, when I moved onto actions like update a review it was still hard to update the ratings, so I decided it would be easier to have this laid out in a virtual on the product page:

```js
productSchema.set('toObject', { virtuals: true });
productSchema.set('toJSON', { virtuals: true });

productSchema.virtual('rating').get(function () {
  return (
    this.reviews.reduce((acc, review) => acc + review.rating, 0) /
    this.reviews.length
  );
});
```

This allowed me to update the reviews, which contained a rating and the steps to find the average rating would automatically be taken.

As well as this, for the update and delete functions on the review’s controller – it was still very difficult to isolate the user profile and edit the reviews. In the end, after lots of trial and error I managed to work out a way in which it worked. For updating a review, the only way in which it seemed to work to update the users, was to break it down into small steps. Step one was to remove the review completely:

```js
await User.findOneAndUpdate(
  { _id: req.currentUser._id },
  { $pull: { reviews: { _id: req.params.reviewId } } }
);
```

Step two, was to push on the new and updated review:

```js
await User.findOneAndUpdate(
  { _id: req.currentUser._id },
  { $push: { reviews: newReview } }
);
```

Once I had worked this out it made deleting the review from the user profile easier, as I could take the first half of that process and simply stop there, remove the review and never replace it.

# Wins

I am very proud of the reviews controller and Schema, as well as the virtual for the ratings. This aspect, although hard, gave me great experience in troubleshooting problems, it also led me to be more confident in helping out other people.
I think for me, getting the cloudinary images to work felt great, I did this mostly in the front end on the register page. Later I merged this with the drag and drop functionality.

```js
const cloudinaryResponse = await API.POST(API.ENDPOINTS.cloudinary, imageData);

const apiReqBody = {
  ...formFields,
  cloudinaryImageId: cloudinaryResponse.data.public_id
};

await API.POST(API.ENDPOINTS.register, apiReqBody);
```

I had to first get the cloudinary image id and attach it onto the formFields data, then I could send it up as the body on the register form. This felt great to get this working as it gives the user pages cool features.
Overall, I think a huge achievement for me is that I had only just started learning MongoDB, and to create a full stack application in one week felt amazing.

# Key Learnings/Takeaways

In this project I definitely feel much more comfortable with troubleshooting and asking for advice when I need it. I think our whole group really came together and worked as a team. Initially we did paired programming to set up the outline for the backend and frontend, so that was a good experience. We also did daily stand-ups and decided to use Trello to keep up to date with each other’s progress.

For this project we had 3 members in our team which is the most we have had so far, this meant it was vital to be in good communication throughout to make sure things like instals and merges go to plan. We had purposefully designated a few times during the day to push and pull all our work and this meant we were constantly up to date.

From the daunting task of using new technologies at the start of the project, I now feel much more comfortable with MongoDB and finding and making use of different npm instals that can be used.

# Bugs

Some of the background colours do not span 100% of the page depending on what is shown. This was simply down to us not having enough time to do detailed testing of the styling. The responsiveness of the nav bar and the home page is also not as we would ideally like it. I think in the future the first thing I would do, before adding new functionalities, I would fix all the responsiveness and styling bugs and get the whole thing looking uniform.

# Future Improvements

Ideally, we would have created links from the reviews on the user profile to the product page for easier navigation, however we didn’t have the time to implement that idea during this project.
