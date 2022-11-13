import PostModel from '../models/Post.js'

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec()

    const tags = posts.map(obj => obj.tags).flat().slice(0, 5)
    res.json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Posts not found ...'
    })
  }
}

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec() // .populate().exec() - для получение информации о пользователе(связывание обьектов)
    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Posts not found ...'
    })
  }
} // получение всех статей 

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id; // получаем id из параметров чтобы найти статью 
    PostModel.findOneAndUpdate(
      {
        _id: postId
      }, {
      $inc: { viewsCount: 1 }
    }, {
      returnDocument: 'after'
    },
      (err, doc) => {
        if (err) {
          console.log(err)
          return res.status(500).json({
            message: 'Couldnot get the article ...'
          })
        }
        if (!doc) {
          return res.status(404).json({
            message: 'Article not found ...'
          })
        }
        res.json(doc)
      }).populate('user')  /* при получении статьи нам необходимо увеличить количество ее просмотра.
  первый параметр - статья, 
  второй - что необходимо изменить в этой статье, 
  третий - возвращаем измененный документ,
  четвертый - функция, которая сообщает выполнилось ли получение статьи
   */
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Posts not found ...'
    })
  }
} // получение одной статьи

export const remove = async (req, res) => {
  try {
    const postId = req.params.id // получаем id из параметров чтобы найти статью 

    PostModel.findOneAndDelete({
      _id: postId
    }, (err, doc) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Couldnot delete the article...'
        })
      }

      if (!doc) {
        return res.staus(404).json({
          message: 'Article not found ...'
        })
      }
      res.json({
        success: true
      })
    }) // первый параметр - находим статью, второй - функция, которая сообщает о том, выполнено удаление или нет

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Posts not found ...'
    })
  }
} // удаление статьи

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId
    }) // создаем пост для записи в базу данных

    const post = await doc.save() // сохраняем пост в базу данных

    res.json(post)

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to create a post ...'
    })
  }
} // создание статьи

export const update = async (req, res) => {
  try {
    const postId = req.params.id // получаем id из параметров чтобы найти статью 
    await PostModel.updateOne({
      _id: postId
    }, {
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      user: req.userId
    })
    res.json({
      success: true
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Failed to update the article ...'
    })
  }
}