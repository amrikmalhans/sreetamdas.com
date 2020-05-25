import Document, {
	DocumentContext,
	Html,
	Head,
	Main,
	NextScript,
} from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const sheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App) => (props) =>
						sheet.collectStyles(<App {...props} />),
				});

			const initialProps = await Document.getInitialProps(ctx);
			return {
				...initialProps,
				styles: (
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>
				),
			};
		} finally {
			sheet.seal();
		}
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<meta
						name="viewport"
						content="initial-scale=1.0, width=device-width"
					/>
					<meta name="description" content="Hey! I'm Sreetam Das" />
					<meta property="og:title" content="Sreetam Das" />

					<link rel="shortcut icon" href="/favicon.png" />
					<meta name="theme-color" content="#ff6600" />
					<link rel="apple-touch-icon" href="/logo.png" />
					<meta
						name="apple-mobile-web-app-title"
						content="Sreetam Das' Blog"
					/>
					<meta
						name="apple-mobile-web-app-status-bar-style"
						content="default"
					/>
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="mobile-web-app-capable" content="yes" />
				</Head>
				<body>
					<script
						dangerouslySetInnerHTML={{
							__html: blockingSetInitialColorMode,
						}}
					></script>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

const blockingSetInitialColorMode = `(function() {
	${setInitialColorMode.toString()}
	setInitialColorMode();
})()`;

function setInitialColorMode() {
	function getInitialColorMode() {
		const persistedColorPreference = window.localStorage.getItem("theme");
		const hasPersistedPreference =
			typeof persistedColorPreference === "string";
		/**
		 * If the user has explicitly chosen light or dark,
		 * use it. Otherwise, this value will be null.
		 */
		if (hasPersistedPreference) {
			return persistedColorPreference;
		}

		/**
		 * If they haven't been explicit, check the media query
		 */
		const mql = window.matchMedia("(prefers-color-scheme: dark)");
		const hasMediaQueryPreference = typeof mql.matches === "boolean";

		if (hasMediaQueryPreference) {
			return mql.matches ? "dark" : "light";
		}

		/**
		 * If they are using a browser/OS that doesn't support
		 * color themes, default to 'light'.
		 */
		return "light";
	}

	const colorMode = getInitialColorMode();
	const root = document.documentElement;
	root.style.setProperty("--initial-color-mode", colorMode);

	if (colorMode === "dark")
		document.documentElement.setAttribute("data-theme", "dark");
}