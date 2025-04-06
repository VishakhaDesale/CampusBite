import classes from './index.module.css';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div className={classes.container}>
            {/* Hero Section */}
            <section className={classes.hero} id="home">
                <div className={classes.heroContent}>
                    <h1>
                        Fresh Food,<br />
                        <span className={classes.highlight}>Delivered</span> To<br />
                        Your Campus
                    </h1>
                    <p>Elevate your campus dining experience with delicious, affordable meals that fuel your academic journey.</p>
                    <div className={classes.buttons}>
                        <Link to="/schedule">
                            <Button type="primary" size="large" className={classes.primaryBtn}>
                                Explore Menu
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button size="large" className={classes.secondaryBtn}>
                                Join Now
                            </Button>
                        </Link>
                    </div>
                    <div className={classes.statRow}>
                        <div className={classes.stat}>
                            <span className={classes.statNumber}>4.8</span>
                            <span className={classes.statLabel}>Customer Rating</span>
                        </div>
                        <div className={classes.statDivider}></div>
                        <div className={classes.stat}>
                            <span className={classes.statNumber}>15+</span>
                            <span className={classes.statLabel}>Daily Specials</span>
                        </div>
                        <div className={classes.statDivider}></div>
                        <div className={classes.stat}>
                            <span className={classes.statNumber}>3K+</span>
                            <span className={classes.statLabel}>Happy Students</span>
                        </div>
                    </div>
                </div>
                <div className={classes.heroImageContainer}>
                    <div className={classes.heroImageWrapper}>
                        <img src="/assets/Dish.png" alt="Delicious Campus Food" className={classes.heroImage} />
                        <div className={classes.foodTag}>
                            <span className={classes.tagIcon}>🔥</span>
                            <span className={classes.tagText}>Most Popular</span>
                        </div>
                    </div>
                    <div className={classes.heroPattern}></div>
                </div>
            </section>

            {/* About Us Section */}
            <section className={classes.about} id="about">
                <div className={classes.aboutWrapper}>
                    <div className={classes.aboutImageSection}>
                        <div className={classes.aboutImageMain}>
                            <img src="data:image/jpeg;base64,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" alt="Our Team Cooking" />
                        </div>
                        <div className={classes.aboutImageAccent}>
                            <img src="https://media.istockphoto.com/id/1081422898/photo/pan-fried-duck.jpg?s=612x612&w=0&k=20&c=kzlrX7KJivvufQx9mLd-gMiMHR6lC2cgX009k9XO6VA=" alt="Food Preparation" />
                        </div>
                        <div className={classes.aboutPattern}></div>
                    </div>
                    <div className={classes.aboutContent}>
                        <h4 className={classes.aboutPreTitle}>Our Story</h4>
                        <h2 className={classes.aboutTitle}>Crafting Campus Cuisine Since <span className={classes.highlight}>2022</span></h2>
                        <p className={classes.aboutText}>
                            CampusBite began with a simple mission: to transform campus dining with delicious, 
                            affordable meals that fuel academic success. We understand the challenges of 
                            student life and craft our menu to provide nutritious options that keep you energized.
                        </p>
                        <p className={classes.aboutText}>
                            What sets us apart is our commitment to quality ingredients, diverse flavors, 
                            and a seamless dining experience designed specifically for campus life.
                        </p>
                        <div className={classes.aboutFeatures}>
                            <div className={classes.aboutFeature}>
                                <div className={classes.featureIcon}>
                                    <i className="fas fa-leaf"></i>
                                </div>
                                <div className={classes.featureText}>
                                    <h4>Fresh Ingredients</h4>
                                    <p>Locally sourced whenever possible</p>
                                </div>
                            </div>
                            <div className={classes.aboutFeature}>
                                <div className={classes.featureIcon}>
                                    <i className="fas fa-utensils"></i>
                                </div>
                                <div className={classes.featureText}>
                                    <h4>Diverse Menu</h4>
                                    <p>Options for all dietary preferences</p>
                                </div>
                            </div>
                        </div>
                        <Link to="/about">
                            <Button type="primary" size="large" className={`${classes.primaryBtn} ${classes.aboutBtn}`}>
                                Our Full Story
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

           

            {/* Contact Section */}
            <section className={classes.contact} id="contact">
                <h2 className={classes.sectionTitle}>Contact Us</h2>
                <p className={classes.contactText}>
                    Have questions? Reach out to us at <a href="mailto:support@campusbite.com">support@campusbite.com</a> or call us at (123) 456-7890.
                </p>
                <div className={classes.contactInfo}>
                    <div className={classes.contactItem}>
                        <i className="fas fa-map-marker-alt"></i>
                        <p>Campus Center, Building 4</p>
                    </div>
                    <div className={classes.contactItem}>
                        <i className="fas fa-clock"></i>
                        <p>Open: Mon-Fri, 7:30 AM - 8:00 PM</p>
                    </div>
                </div>
            </section>
        </div>
    );
}