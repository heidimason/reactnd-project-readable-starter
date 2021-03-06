import React, { Component } from 'react'
import {
  CategoriesDiv,
  PostsDiv,
  PostHeading
} from '../../utils/styles'
import { cyanA400, white, grey500, fullBlack } from 'material-ui/styles/colors'
import sortBy from 'sort-by'
import { Tabs, Tab } from 'material-ui/Tabs'
import LoadingAnimation from '../Progress/circular'
import ListPosts from '../Posts'
import AddPostBtn from '../Buttons/floating'
import ScrollableDialog from 'material-ui/Dialog'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import TextField from 'material-ui/TextField'
import FlatButton from 'material-ui/FlatButton'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { getCategories } from './actions'
import { getPosts, addPost } from '../Posts/actions'
import serializeForm from 'form-serialize'
import uuid from 'uuid'

class ListCategories extends Component {
  // Get all categories and posts immediately after component is inserted into DOM
  componentDidMount() {
    const { getAllCategories, getAllPosts } = this.props

    getAllCategories().then( () =>
      getAllPosts().then( () =>
        // Stop showing loading animation
        this.setState({
          loading: false
        })
      )
    )
  }

  state = {
    loading: true,
    tabValue: this.props.location.pathname.split('/')[1], // Category name/path
    orderValue: '-timestamp',
    postModalOpen: false,
    category: '',
    title: '',
    author: '',
    body: ''
  }

  changeTab = tabValue => {
    this.setState({tabValue})
  }

  orderPosts = (event, index, orderValue) => {
    this.setState({orderValue})

    this.props.getAllPosts()
  }

  openPostModal = () => {
    this.setState({postModalOpen: true})
  }

  closePostModal = () => {
    this.setState({postModalOpen: false})
  }

  changeCategory = (event, index, category) => {
    this.setState({category})
  }

  changeTitle = e => {
    this.setState({title: e.target.value})
  }

  changeAuthor = e => {
    this.setState({author: e.target.value})
  }

  changeBody = e => {
    this.setState({body: e.target.value})
  }

  submitPost = e => {
    e.preventDefault()

    const values = serializeForm(e.target, { hash: true })

    const post = Object.assign(values, {
      id: uuid(),
      timestamp: Date.now(),
      title: this.state.title,
      body: this.state.body,
      author: this.state.author,
      category: this.state.category
    })

    // Dispatch action
    this.props.add(post)

    // Close modal upon submitting form
    this.closePostModal()

    // Reset fields
    this.setState({
      category: '',
      title: '',
      author: '',
      body: ''
    })
  }

  render() {
      const { loading, orderValue, postModalOpen } = this.state,
                    { categories, history, posts } = this.props,

            // Submit post
            actions = [
              <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.closePostModal}
                style={{marginRight: 15}}
              />,

              <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onClick={this.submitPost}
                backgroundColor={cyanA400}
                hoverColor={cyanA400}
              />
            ]

    posts.sort(sortBy(orderValue))

    return (
      <div style={{width: '100%'}}>
        <CategoriesDiv>
          <Tabs
            value={this.state.tabValue}
            onChange={this.changeTab}>
            {categories.map( (category, index) => (
              /* TODO: Fix active tab with browser back button */
              <Tab
                label={category.name}
                key={index}
                value={category.name}
                onActive={ () => {
                  history.push(`/${category.path}`)
                }}>
                <PostsDiv>
                  <SelectField
                    floatingLabelText="Order By"
                    value={orderValue}
                    onChange={this.orderPosts}
                    floatingLabelStyle={{color: white}}
                    menuItemStyle={{color: fullBlack}}
                    className="order-by">
                    <MenuItem value="-timestamp" primaryText="Timestamp (most recent)" />
                    <MenuItem value="timestamp" primaryText="Timestamp (least recent)" />
                    <MenuItem value="-voteScore" primaryText="Vote Score (highest)" />
                    <MenuItem value="voteScore" primaryText="Vote Score (lowest)" />
                  </SelectField>

                  <PostHeading>{category.name}</PostHeading>

                  { loading &&
                    <LoadingAnimation />
                  }

                  {category.path === 'all' ?
                    <ListPosts showingPosts={posts} />
                    :
                    <ListPosts showingPosts={posts.filter( post => post.category === category.name )} />
                  }
                </PostsDiv>
              </Tab>
            ))}
          </Tabs>

          <AddPostBtn
            onClick={this.openPostModal}
          />

          <ScrollableDialog
            title="Create Post"
            actions={actions}
            modal={false}
            open={postModalOpen}
            onRequestClose={this.closePostModal}
            autoScrollBodyContent={true}
            titleStyle={{color: fullBlack}}>
            <form>
              <SelectField
                floatingLabelText="Category"
                value={this.state.category}
                onChange={this.changeCategory}
                autoWidth={true}
                menuItemStyle={{color: fullBlack}}
                className="select-category">
                <MenuItem value="freshwater" primaryText="Freshwater" />
                <MenuItem value="planted" primaryText="Planted" />
                <MenuItem value="discussion" primaryText="Discussion" />
              </SelectField>

              <TextField
                floatingLabelText="Title"
                floatingLabelStyle={{color: grey500}}
                inputStyle={{color: fullBlack}}
                value={this.state.title}
                onChange={this.changeTitle}
                className="input-title-post"
              />

              <TextField
                hintText="Your Name"
                floatingLabelText="Author"
                floatingLabelStyle={{color: grey500}}
                inputStyle={{color: fullBlack}}
                value={this.state.author}
                onChange={this.changeAuthor}
                className="input-author-post"
              />

              <TextField
                floatingLabelText="Message"
                floatingLabelStyle={{color: grey500}}
                textareaStyle={{color: fullBlack}}
                multiLine={true}
                rows={2}
                rowsMax={4}
                fullWidth={true}
                value={this.state.body}
                onChange={this.changeBody}
              />
            </form>
          </ScrollableDialog>
        </CategoriesDiv>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    categories: state.categories,
    posts: state.posts
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getAllCategories: () => dispatch( getCategories() ),
    getAllPosts: () => dispatch( getPosts() ),
    add: post => dispatch ( addPost(post) )
  }
}

export default withRouter( connect(mapStateToProps, mapDispatchToProps)(ListCategories) )