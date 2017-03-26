/* @jsx h */

// Inline ES modules dependencies using Rollup:
import { h, render } from 'preact'

// Import CommonJS-style modules--this will be bundled by Webpack:
import cx from 'classnames'

// Import using configured Webpack loaders:
import style from './styles/style.css'

// Or import CSS from npm modules...
import 'tachyons'

// And resolve aliased modules:
import source from 'raw-loader!webpackConfig'

import SyntaxHighlight from './components/SyntaxHighlight'

render((
  <div className={cx('mv2', 'mh6')}>
    <h1 className={style.header}>
      Rollup Webpack Loader Example
    </h1>
    <SyntaxHighlight source={source} />
  </div>
), document.body)
