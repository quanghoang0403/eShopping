// Render theme
// Render all components of theme with store's theme setting
export function ThemeWrapper({ theme, themeSetting }) {
  return (
    <>
      <theme.component themeSetting={themeSetting} />
    </>
  );
}
