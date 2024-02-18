import { Editor } from "@tinymce/tinymce-react";
import { TINY_MCE_API_KEY } from "constants/application.constants";

export function FnbEditor(props) {
  const { value, className, onChange, editorRef } = props;

  return (
    <Editor
      apiKey={TINY_MCE_API_KEY}
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={value}
      onEditorChange={onChange}
      className={className}
      init={{
        height: 300,
        menubar: false,
        setup: () => {
          var newColor = document.createElement("style");
          document.head.appendChild(newColor);
          newColor.sheet.insertRule(
            ".tox-toolbar__primary { background-color: #F7F5FF !important; } ",
          );
          newColor.sheet.insertRule(
            ".tox-editor-header { background-color: #F7F5FF !important; } "
          );
        },
        formats: {
          underline: {
            inline: "span",
            styles: { "text-decoration": "underline" },
            exact: true,
          },
        },
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | casechange blocks | alignleft aligncenter alignright alignjustify | " +
          "bold italic underline | " +
          "image link",
        block_formats: "Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;",
        content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
    />
  );
}
