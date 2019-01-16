declare module 'fingerprintjs2';
/**
 *  Declare globals
 */
declare var API_URL: string;
declare module 'window' {
    const value: Window;
    export default value;
}
declare var XDomainRequest: any;
declare module "*.json" {
    const value: any;
    export default value;
}
