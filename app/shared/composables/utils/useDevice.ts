import { useDevice as useDeviceResolver } from '#imports'

export const useDevice = () => {
    // Bindings
    const device = useDeviceResolver()

    // Devices
    const isIosDevice = computed(() => device.isIos)
    const isMobileDevice = computed(() => device.isMobile)
    const isTabletDevice = computed(() => device.isTablet)
    const isDesktopDevice = computed(() => device.isDesktop)
    const isAndroidDevice = computed(() => device.isAndroid)
    const isMobileOrTabletDevice = computed(() => device.isMobileOrTablet)
    const isDesktopOrTabletDevice = computed(() => device.isDesktopOrTablet)

    return {
        isIosDevice,
        isMobileDevice,
        isTabletDevice,
        isDesktopDevice,
        isAndroidDevice,
        isMobileOrTabletDevice,
        isDesktopOrTabletDevice
    }
}
