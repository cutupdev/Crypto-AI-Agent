import Link from "next/link";
import { motion } from "framer-motion";
import ProdImg from "../../assets/prod_1.png";

////////////////////////////////////////////

// custom animations
let easing = [0.6, -0.05, 0.01, 0.99];

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
    transition: { duration: 0.6, ease: easing },
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: easing,
    },
  },
};

const Product = () => {
  return (
    <motion.div initial="initial" animate="animate" exit={{ opacity: 0 }}>
      <div className="fullscreen">
        <div className="product">
          <motion.div
            className="img"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.img
              src={ProdImg.src}
              alt="product"
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
            />
          </motion.div>
          <div className="product-details">
            <motion.div variants={stagger} className="inner">
              <Link href="/">
                <motion.div variants={fadeInUp}>
                  <a className="go-back">Back to products</a>
                </motion.div>
              </Link>
              <motion.div variants={fadeInUp}>
                <span className="category">Protein</span>
              </motion.div>
              <motion.h1 variants={fadeInUp}>Mush potatoes</motion.h1>
              <motion.p variants={fadeInUp}>
                A very cool mashed potato for all the lovers of potatoes and
                vegan oil.
              </motion.p>

              <motion.div variants={fadeInUp} className="additionals">
                <span>Soy Free</span>
                <span>Gluten Free</span>
              </motion.div>

              <motion.div variants={fadeInUp} className="qty-price">
                <div className="qty">
                  <div className="minus">-</div>
                  <div className="amount">1</div>
                  <div className="add">+</div>
                </div>
                <span className="price">$13.99</span>
              </motion.div>

              <motion.div variants={fadeInUp} className="btn-row">
                <button className="add-to-cart">Add to cart</button>
                <button className="subscribe">Subscribe</button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Product;
