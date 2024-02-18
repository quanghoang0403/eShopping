import { Form } from "antd";

export default function EditEmailCampaignHiddenValuesComponent(props) {
  const { defaultSocialLinks } = props;

  return (
    <>
      {/* General  */}
      <Form.Item name="id" hidden />
      <Form.Item name="name" hidden />
      <Form.Item name="description" hidden />
      <Form.Item name="sendingTime" hidden />
      <Form.Item name="emailSubject" hidden />
      <Form.Item name="emailCampaignType" hidden />
      <Form.Item name="customerSegmentIds" hidden />
      <Form.Item name="emailAddress" hidden />

      {/* Customize - content */}
      <Form.Item name="mainProductId" hidden />
      <Form.Item name="mainProductImage" hidden />
      <Form.Item name="mainProductTitle" hidden />
      <Form.Item name="mainProductDescription" hidden />
      <Form.Item name="mainProductButton" hidden />
      <Form.Item name="mainProductUrl" hidden />

      <Form.Item name="firstSubProductId" hidden />
      <Form.Item name="firstSubProductImage" hidden />
      <Form.Item name="firstSubProductTitle" hidden />
      <Form.Item name="firstSubProductDescription" hidden />
      <Form.Item name="firstSubProductButton" hidden />
      <Form.Item name="firstSubProductUrl" hidden />

      <Form.Item name="secondSubProductId" hidden />
      <Form.Item name="secondSubProductImage" hidden />
      <Form.Item name="secondSubProductTitle" hidden />
      <Form.Item name="secondSubProductDescription" hidden />
      <Form.Item name="secondSubProductButton" hidden />
      <Form.Item name="secondSubProductUrl" hidden />

      {/* Customize - header */}
      <Form.Item name="logo" hidden />
      <Form.Item name="emailTitle" hidden />

      {/* Customize - footer */}
      {defaultSocialLinks?.map((social) => {
        return (
          <>
            <Form.Item name={[social.name, "id"]} hidden />
            <Form.Item name={[social.name, "url"]} hidden />
            <Form.Item name={[social.name, "isActive"]} hidden />
          </>
        );
      })}
    </>
  );
}
