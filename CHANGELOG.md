# Changelog

## [Unreleased]

## [2.0.0] (2021-04-11)

No notable changes.

## [2.0.0-beta1] (2021-04-11)

### Breaking changes

- Added type inference for `event.currentTarget`

  This is technically a breaking change because this feature required the types `DelegationListener` and `DelegationEvent`
  to take an additional type argument for the root element type. However, if you never imported and used these types
  explicitly this change should not affect you.

### Added

- Method `EventDelegation.withinMany()` to explicitly create multiple listeners at once.

## [1.0.0] (2021-04-10)

### Breaking changes

- Completely rebuilt the package with a better API and improved type inference.

## [0.4.4] (2019-06-08)

### Breaking changes

- Renamed interface `DelegationListener` to `EventHandler`

### Added

- Event type parameter to `DelegationListenerFn` type constructor

## [0.4.3] (2019-06-05)

### Fixed

- Import polyfill in `closestWithin` module

## [0.4.2] (2019-02-08)

- No notable changes.

## [0.4.1] (2019-02-08)

### Fixed

- Added proper polyfill for `Element.prototype.matches()`

## [0.4.0] (2018-11-02)

### Development

- Added test suite
- Refactoring of internal code

## [0.3.0] (2018-11-02)

### Added

- Type parameters for annotating the expected type of delegator elements.

## [0.2.1] (2018-11-02)

### Added

- CDN snippet to README

### Fixed

- UMD bundle namespace

## [0.2.0] (2018-10-27)

### Added

- Added `delegator` property to events as an alternative to explicit this-binding

## [0.1.2] (2018-10-18)

- Implemented application of `listenerOptions` configuration
- README changes

## [0.1.1] (2018-10-17)

- npm ignore fix
- add npm version to README.md

## [0.1.0] (2018-10-17, Initial release)

- Initial version

[Unreleased]: https://github.com/JJWesterkamp/event-delegation/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/JJWesterkamp/event-delegation/compare/v2.0.0-beta1...v2.0.0
[2.0.0-beta1]: https://github.com/JJWesterkamp/event-delegation/compare/v1.0.0...v2.0.0-beta1
[1.0.0]: https://github.com/JJWesterkamp/event-delegation/compare/v0.4.4...v1.0.0
[0.4.4]: https://github.com/JJWesterkamp/event-delegation/compare/v0.4.3...v0.4.4
[0.4.3]: https://github.com/JJWesterkamp/event-delegation/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/JJWesterkamp/event-delegation/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/JJWesterkamp/event-delegation/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/JJWesterkamp/event-delegation/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/JJWesterkamp/event-delegation/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/JJWesterkamp/event-delegation/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/JJWesterkamp/event-delegation/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/JJWesterkamp/event-delegation/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/JJWesterkamp/event-delegation/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/JJWesterkamp/event-delegation/tree/v0.1.0
