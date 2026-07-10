const normalizeCategoryString = (str) => {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/['’\s-]/g, '');
};

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      stock,
      sort,
      featured,
      trending,
      bestSeller,
      newArrival,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // 1. Search / Keyword Match (Name, Brand, Description)
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { brand: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // 2. Category Filter
    if (category && category !== 'all' && category.trim() !== '') {
      const targetNorm = normalizeCategoryString(category);
      const allCategories = await Product.distinct('category');
      const matchedCategories = allCategories.filter(c => normalizeCategoryString(c) === targetNorm);

      if (matchedCategories.length > 0) {
        query.category = { $in: matchedCategories };
      } else {
        query.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
      }
    }

    // 2b. Boolean Flag Filters
    if (featured === 'true' || featured === true) {
      query.featured = true;
    }
    if (trending === 'true' || trending === true) {
      query.trending = true;
    }
    if (bestSeller === 'true' || bestSeller === true) {
      query.bestSeller = true;
    }
    if (newArrival === 'true' || newArrival === true) {
      query.newArrival = true;
    }

    // 3. Brand Filter
    if (brand && brand !== 'all' && brand.trim() !== '') {
      query.brand = { $regex: new RegExp(`^${brand.trim()}$`, 'i') };
    }

    // 4. Price Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 5. Rating Filter
    if (rating && Number(rating) > 0) {
      query.rating = { $gte: Number(rating) };
    }

    // 6. Stock Filter
    if (stock) {
      if (stock === 'inStock') {
        query.stock = { $gt: 0 };
      } else if (stock === 'outOfStock') {
        query.stock = 0;
      }
    }

    // 7. Sort Options
    let sortQuery = {};
    if (sort) {
      if (sort === 'priceAsc' || sort === 'price-low-high') {
        sortQuery.price = 1;
      } else if (sort === 'priceDesc' || sort === 'price-high-low') {
        sortQuery.price = -1;
      } else if (sort === 'ratingDesc' || sort === 'highest-rated') {
        sortQuery.rating = -1;
      } else if (sort === 'newest') {
        sortQuery.createdAt = -1;
      } else if (sort === 'bestSelling' || sort === 'best-selling') {
        sortQuery.numReviews = -1;
      } else {
        sortQuery.createdAt = -1;
      }
    } else {
      sortQuery.createdAt = -1; // Default: newest
    }

    // 8. Pagination Calculations
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skipNum = (pageNum - 1) * limitNum;

    // Count total matched documents
    const totalCount = await Product.countDocuments(query);
    
    // Execute query with sort, skip, limit
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip(skipNum)
      .limit(limitNum);

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(totalCount / limitNum),
      totalProducts: totalCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      image,
      stock,
      rating,
      numReviews,
      tag,
      featured,
      trending,
      bestSeller,
      newArrival,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      brand,
      image,
      stock,
      rating: rating || 0,
      numReviews: numReviews || 0,
      tag: tag || '',
      featured: featured || false,
      trending: trending || false,
      bestSeller: bestSeller || false,
      newArrival: newArrival || false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      image,
      stock,
      rating,
      numReviews,
      tag,
      featured,
      trending,
      bestSeller,
      newArrival,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name !== undefined ? name : product.name;
      product.description = description !== undefined ? description : product.description;
      product.price = price !== undefined ? price : product.price;
      product.category = category !== undefined ? category : product.category;
      product.brand = brand !== undefined ? brand : product.brand;
      product.image = image !== undefined ? image : product.image;
      product.stock = stock !== undefined ? stock : product.stock;
      product.rating = rating !== undefined ? rating : product.rating;
      product.numReviews = numReviews !== undefined ? numReviews : product.numReviews;
      product.tag = tag !== undefined ? tag : product.tag;
      product.featured = featured !== undefined ? featured : product.featured;
      product.trending = trending !== undefined ? trending : product.trending;
      product.bestSeller = bestSeller !== undefined ? bestSeller : product.bestSeller;
      product.newArrival = newArrival !== undefined ? newArrival : product.newArrival;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
