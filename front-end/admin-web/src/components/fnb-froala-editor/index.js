import { message } from 'antd'
import { forwardRef, useEffect, useState } from 'react'
import FroalaEditor from 'react-froala-wysiwyg'
// Require Editor CSS files.
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/plugins/image.min.css'
// Require Editor JS files.
import { env } from 'env'
import 'froala-editor/js/froala_editor.pkgd.min.js'
import 'froala-editor/js/plugins.pkgd.min.js'
import { useTranslation } from 'react-i18next'
import i18n from 'utils/i18n'
import '../../components/shop-froala-editor/custom-language/vi'

const FnbFroalaEditor = forwardRef((props, ref) => {
  const {
    value,
    onChange,
    charCounterCount = true,
    charCounterMax = 1000,
    heightMin = 300,
    heightMax = 550,
    placeholder
  } = props

  const uploadUrl = `${env.REACT_APP_ROOT_DOMAIN}/api/file/upload-froala`
  const fileSizeLimit = 10 * 1024 * 1024 // 10MB
  const [t] = useTranslation()
  // reference: https://froala.com/wysiwyg-editor/docs/options
  const toolbarButtons = [
    'fullscreen',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'subscript',
    'superscript',
    '|',
    'fontFamily',
    'fontSize',
    'textColor',
    'color',
    'inlineStyle',
    'paragraphStyle',
    '|',
    'emoticons',
    'specialCharacters',
    'insertHR',
    'selectAll',
    'clearFormatting',
    '|',
    'paragraphFormat',
    'align',
    'formatOL',
    'formatUL',
    'outdent',
    'indent',
    'quote',
    '-',
    'insertLink',
    'insertImage',
    'insertTable', // 'insertVideo', 'insertFile',
    '|',
    'print',
    'help',
    'html',
    '|',
    'undo',
    'redo',
    'trackChanges',
    'markdown'
  ]

  const [config, setConfig] = useState({
    key: env.REACT_APP_FROALA_API_KEY,
    useClasses: false,
    attribution: false,
    toolbarSticky: false,
    charCounterCount,
    charCounterMax,
    fontFamilySelection: true,
    fontSizeSelection: true,
    paragraphFormatSelection: true,
    heightMin,
    heightMax,
    linkInsertButtons: [],
    pluginsEnabled: [
      'pkgd', // Must use UTF-8 for Search
      'align',
      'charCounter',
      'image',
      'link',
      'lists',
      'table',
      'colors',
      'draggable',
      'emoticons',
      // 'entities', // error UTF-8
      'file',
      'fontAwesome',
      'fontFamily',
      'fontSize',
      'fullscreen',
      'image',
      'imageTUI',
      'imageManager',
      'inlineStyle',
      'inlineClass',
      'lineBreaker',
      'lineHeight',
      'link',
      'lists',
      'paragraphFormat',
      'paragraphStyle',
      'quickInsert',
      'quote',
      'table',
      'url',
      'video',
      'wordPaste'
    ],

    toolbarButtons,

    // Set the image upload URL.
    imageUploadURL: uploadUrl,

    // Set the image upload parameter.
    // imageUploadParam: 'file',

    // Additional upload params.
    imageUploadParams: {
      fileSizeLimit
    },

    // Set request type.
    imageUploadMethod: 'POST',

    // Set max image size to 10MB.
    imageMaxSize: fileSizeLimit,

    // Allow to upload PNG and JPG.
    imageAllowedTypes: ['jpeg', 'jpg', 'png', 'gif'],

    events: {
      'image.beforeUpload': function (images) {
        // Return false if you want to stop the image upload.
        const size = images[0].size
        if (size > fileSizeLimit) {
          message.error(t('messages.imageSizeTooBigMoreThan10MB'))
          return false
        }
      },

      'image.uploaded': function (response) {
        // Image was uploaded to the server.
      },
      'image.inserted': function ($img, response) {
        // Image was inserted in the editor.
      },
      'image.replaced': function ($img, response) {
        // Image was replaced in the editor.
      },
      'image.error': function (error, response) {
        if (error.code === 1) { // Bad link.
          console.log(error, response)
        } else if (error.code === 2) { // No link in upload response.
          console.log(error, response)
        } else if (error.code === 3) {
          console.log(error, response) // Error during image upload.
        } else if (error.code === 4) { // Parsing response failed.
          console.log(error, response)
        } else if (error.code === 5) { // Image too text-large.
          console.log(error, response)
        } else if (error.code === 6) { // Invalid image type.
          console.log(error, response)
        } else if (error.code === 7) { // Image can be uploaded only to same domain in IE 8 and IE 9.
          console.log(error, response)
        }
        // Response contains the original server response to the request if available.
      }
    }
  })
  const [childKey, setChildKey] = useState(1)

  useEffect(() => {
    const languageCode = i18n.language
    setConfig((prevConfig) => ({
      ...prevConfig,
      placeholderText: placeholder,
      language: languageCode
    }))
    setChildKey((prev) => prev + 1)
  }, [placeholder, i18n.language])

  return <FroalaEditor key={childKey} ref={ref} config={config} model={value} onModelChange={onChange} />
})

export default FnbFroalaEditor
