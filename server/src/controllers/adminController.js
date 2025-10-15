import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

export const adminLogin = async (req, res)=>{
    try {
        const {email, password} = req.body;

        // Find user by email
        const user = await User.findOne({ email, isActive: true });
        
        if (!user) {
            return res.json({success: false, message: "Invalid Credentials"})
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        
        if (!isPasswordValid) {
            return res.json({success: false, message: "Invalid Credentials"})
        }

        // Create JWT with user info
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                name: user.name,
                role: user.role 
            }, 
            process.env.JWT_SECRET
        )
        
        res.json({
            success: true, 
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getAllBlogsAdmin = async (req, res) =>{
    try {
        const blogs = await Blog.find({}).sort({createdAt: -1});
        res.json({
            success: true,
            count: blogs.length,
            blogs
        })
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getAllComments = async (req, res) =>{
    try {
        const comments = await Comment.find({}).populate('blog').sort({createdAt: -1})
        res.json({
            success: true,
            count: comments.length,
            comments
        })
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const getDashboard = async (req, res) =>{
    try {
        const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments()
        const drafts = await Blog.countDocuments({isPublished: false})

        const dashboardData = {
            blogs, comments, drafts, recentBlogs
        }
        res.json({success: true, dashboardData})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const deleteCommentById = async (req, res) =>{
    try {
        const {id} = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({success: true, message:"Comment deleted successfully" })
    } catch (error) {
       res.json({success: false, message: error.message}) 
    }
}

export const approveCommentById = async (req, res) =>{
    try {
        const {id} = req.body;
        await Comment.findByIdAndUpdate(id, {isApproved: true});
        res.json({success: true, message:"Comment approved successfully" })
    } catch (error) {
       res.json({success: false, message: error.message}) 
    }
}