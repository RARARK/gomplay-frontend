declare module "*.webp" {
  // Metro resolves static image imports to a numeric asset id at runtime.
  const content: number;
  export default content;
}
