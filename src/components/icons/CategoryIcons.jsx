import PropTypes from 'prop-types';

const categoryOrder = [
    'html',
    'react',
    'nextjs',
    'javascript',
    'typescript',
    'css',
    // ...diğer kategoriler
];

export const CategoryIcon = ({ name, className = "w-6 h-6" }) => {
    // İkon adını küçük harfe çevirip boşlukları kaldıralım
    const iconName = name.toLowerCase().replace(/\s+/g, '');
    
    const icons = {
        'react': (
            <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none">
                <path d="M18.6789 15.9759C18.6789 14.5415 17.4796 13.3785 16 13.3785C14.5206 13.3785 13.3211 14.5415 13.3211 15.9759C13.3211 17.4105 14.5206 18.5734 16 18.5734C17.4796 18.5734 18.6789 17.4105 18.6789 15.9759Z" fill="#53C1DE"/>
<path d="M24.7004 11.1537C25.2661 8.92478 25.9772 4.79148 23.4704 3.39016C20.9753 1.99495 17.7284 4.66843 16.0139 6.27318C14.3044 4.68442 10.9663 2.02237 8.46163 3.42814C5.96751 4.82803 6.73664 8.8928 7.3149 11.1357C4.98831 11.7764 1 13.1564 1 15.9759C1 18.7874 4.98416 20.2888 7.29698 20.9289C6.71658 23.1842 5.98596 27.1909 8.48327 28.5877C10.9973 29.9932 14.325 27.3945 16.0554 25.7722C17.7809 27.3864 20.9966 30.0021 23.4922 28.6014C25.9956 27.1963 25.3436 23.1184 24.7653 20.8625C27.0073 20.221 31 18.7523 31 15.9759C31 13.1835 26.9903 11.7923 24.7004 11.1537ZM24.4162 19.667C24.0365 18.5016 23.524 17.2623 22.8971 15.9821C23.4955 14.7321 23.9881 13.5088 24.3572 12.3509C26.0359 12.8228 29.7185 13.9013 29.7185 15.9759C29.7185 18.07 26.1846 19.1587 24.4162 19.667ZM22.85 27.526C20.988 28.571 18.2221 26.0696 16.9478 24.8809C17.7932 23.9844 18.638 22.9422 19.4625 21.7849C20.9129 21.6602 22.283 21.4562 23.5256 21.1777C23.9326 22.7734 24.7202 26.4763 22.85 27.526ZM9.12362 27.5111C7.26143 26.47 8.11258 22.8946 8.53957 21.2333C9.76834 21.4969 11.1286 21.6865 12.5824 21.8008C13.4123 22.9332 14.2816 23.9741 15.1576 24.8857C14.0753 25.9008 10.9945 28.557 9.12362 27.5111ZM2.28149 15.9759C2.28149 13.874 5.94207 12.8033 7.65904 12.3326C8.03451 13.5165 8.52695 14.7544 9.12123 16.0062C8.51925 17.2766 8.01977 18.5341 7.64085 19.732C6.00369 19.2776 2.28149 18.0791 2.28149 15.9759ZM9.1037 4.50354C10.9735 3.45416 13.8747 6.00983 15.1159 7.16013C14.2444 8.06754 13.3831 9.1006 12.5603 10.2265C11.1494 10.3533 9.79875 10.5569 8.55709 10.8297C8.09125 9.02071 7.23592 5.55179 9.1037 4.50354ZM20.3793 11.5771C21.3365 11.6942 22.2536 11.85 23.1147 12.0406C22.8562 12.844 22.534 13.6841 22.1545 14.5453C21.6044 13.5333 21.0139 12.5416 20.3793 11.5771ZM16.0143 8.0481C16.6054 8.66897 17.1974 9.3623 17.7798 10.1145C16.5985 10.0603 15.4153 10.0601 14.234 10.1137C14.8169 9.36848 15.414 8.67618 16.0143 8.0481ZM9.8565 14.5444C9.48329 13.6862 9.16398 12.8424 8.90322 12.0275C9.75918 11.8418 10.672 11.69 11.623 11.5748C10.9866 12.5372 10.3971 13.5285 9.8565 14.5444ZM11.6503 20.4657C10.6679 20.3594 9.74126 20.2153 8.88556 20.0347C9.15044 19.2055 9.47678 18.3435 9.85796 17.4668C10.406 18.4933 11.0045 19.4942 11.6503 20.4657ZM16.0498 23.9915C15.4424 23.356 14.8365 22.6531 14.2448 21.8971C15.4328 21.9423 16.6231 21.9424 17.811 21.891C17.2268 22.6608 16.6369 23.3647 16.0498 23.9915ZM22.1667 17.4222C22.5677 18.3084 22.9057 19.1657 23.1742 19.9809C22.3043 20.1734 21.3652 20.3284 20.3757 20.4435C21.015 19.4607 21.6149 18.4536 22.1667 17.4222ZM18.7473 20.5941C16.9301 20.72 15.1016 20.7186 13.2838 20.6044C12.2509 19.1415 11.3314 17.603 10.5377 16.0058C11.3276 14.4119 12.2404 12.8764 13.2684 11.4158C15.0875 11.2825 16.9178 11.2821 18.7369 11.4166C19.7561 12.8771 20.6675 14.4086 21.4757 15.9881C20.6771 17.5812 19.7595 19.1198 18.7473 20.5941ZM22.8303 4.4666C24.7006 5.51254 23.8681 9.22726 23.4595 10.8426C22.2149 10.5641 20.8633 10.3569 19.4483 10.2281C18.6239 9.09004 17.7698 8.05518 16.9124 7.15949C18.1695 5.98441 20.9781 3.43089 22.8303 4.4666Z" fill="#53C1DE"/>
  </svg>
        ),
        'nextjs': (
            <svg className={className} viewBox="0 0 32 32">
                <path fill="#000000" d="M16 0C7.2 0 0 7.2 0 16s7.2 16 16 16 16-7.2 16-16S24.8 0 16 0zm0 28C9.6 28 4.4 22.8 4.4 16S9.6 4 16 4s11.6 5.2 11.6 11.6-5.2 11.6-11.6 11.6z"/>
                <path fill="#FFFFFF" d="M16 4.4c-5.2 0-10.4 5.2-10.4 10.4s5.2 10.4 10.4 10.4 10.4-5.2 10.4-10.4S21.2 4.4 16 4.4zm0 19.2c-4.4 0-8.8-4.4-8.8-8.8s4.4-8.8 8.8-8.8 8.8 4.4 8.8 8.8-4.4 8.8-8.8 8.8-8.8z"/>
                <path fill="#FFFFFF" d="M16 10.4c-2.4 0-4.8 2.4-4.8 4.8s2.4 4.8 4.8 4.8 4.8-2.4 4.8-4.8S18.4 10.4 16 10.4zm0 8c-1.2 0-2.4-1.2-2.4-2.4s1.2-2.4 2.4-2.4 2.4 1.2 2.4 2.4-1.2 2.4-2.4 2.4-2.4z"/>
            </svg>
        ),
        'framermotion': (
            <svg className={className} viewBox="3.7 3.7 43.6 43.6" xmlns="http://www.w3.org/2000/svg">
  <path d="M47.3 3.7v21.8l-10.9 10.9-10.9 10.9-10.9-10.9 10.9-10.9v.1-.1z" fill="#59529d"/>
  <path d="M47.3 25.5v21.8l-10.9-10.9z" fill="#5271b4"/>
  <path d="M25.5 25.5l-10.9 10.9-10.9 10.9V3.7l10.9 10.9z" fill="#bb4b96"/>
</svg>

        ),
        // Programming Languages
        'javascript': (
            <svg className={className} viewBox="0 0 32 32">
                <path fill="#F7DF1E" d="M0 0h32v32H0z"/>
                <path d="M8.453 24.378l2.217-1.34c.427.756.816 1.396 1.748 1.396.893 0 1.457-.35 1.457-1.708V13.37h2.727v9.395c0 2.823-1.65 4.107-4.058 4.107-2.175 0-3.437-1.126-4.091-2.494m9.61-.272l2.216-1.282c.583.951 1.35 1.65 2.69 1.65 1.126 0 1.845-.563 1.845-1.34 0-.932-.738-1.262-1.98-1.806l-.68-.292c-1.961-.835-3.262-1.883-3.262-4.097 0-2.039 1.553-3.592 3.981-3.592 1.728 0 2.97.602 3.864 2.175l-2.117 1.36c-.466-.835-.97-1.165-1.747-1.165-.796 0-1.301.505-1.301 1.165 0 .816.505 1.146 1.67 1.65l.68.291c2.31.99 3.611 2 3.611 4.272 0 2.447-1.922 3.786-4.504 3.786-2.524 0-4.155-1.204-4.966-2.775"/>
            </svg>
        ),
        'typescript': (
                <svg className={className}
            viewBox="0 0 512 512"><rect
            width="512" height="512"
            rx="15%"
            fill="#3178c6"/><path fill="#ffffff"
            d="m233 284h64v-41H118v41h64v183h51zm84 173c8.1 4.2 18 7.3 29 9.4s23 3.1 35 3.1c12 0 23-1.1 34-3.4c11-2.3 20-6.1 28-11c8.1-5.3 15-12 19-21s7.1-19 7.1-32c0-9.1-1.4-17-4.1-24s-6.6-13-12-18c-5.1-5.3-11-10-18-14s-15-8.2-24-12c-6.6-2.7-12-5.3-18-7.9c-5.2-2.6-9.7-5.2-13-7.8c-3.7-2.7-6.5-5.5-8.5-8.4c-2-3-3-6.3-3-10c0-3.4.89-6.5 2.7-9s4.3-5.1 7.5-7.1c3.2-2 7.2-3.5 12-4.6c4.7-1.1 9.9-1.6 16-1.6c4.2 0 8.6.31 13 .94c4.6.63 9.3 1.6 14 2.9c4.7 1.3 9.3 2.9 14 4.9c4.4 2 8.5 4.3 12 6.9v-47c-7.6-2.9-16-5.1-25-6.5s-19-2.1-31-2.1c-12 0-23 1.3-34 3.8s-20 6.5-28 12c-8.1 5.4-14 12-19 21c-4.7 8.4-7 18-7 30c0 15 4.3 28 13 38c8.6 11 22 19 39 27c6.9 2.8 13 5.6 19 8.3s11 5.5 15 8.4c4.3 2.9 7.7 6.1 10 9.5c2.5 3.4 3.8 7.4 3.8 12c0 3.2-.78 6.2-2.3 9s-3.9 5.2-7.1 7.2s-7.1 3.6-12 4.8c-4.7 1.1-10 1.7-17 1.7c-11 0-22-1.9-32-5.7c-11-3.8-21-9.5-28.1-15.44z"/></svg>
         ),
        // Core Web Technologies
        'html': (
            <svg className={className} viewBox="0 0 24 24" fill="red">
            <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/>
        </svg>
        ),
        'css': (
            <svg className={className} viewBox="0 0 32 32">
                <path d="M6 28L4 3H28L26 28L16 31L6 28Z" fill="#1172B8"/>
<path d="M26 5H16V29.5L24 27L26 5Z" fill="#33AADD"/>
<path d="M19.5 17.5H9.5L9 14L17 11.5H9L8.5 8.5H24L23.5 12L17 14.5H23L22 24L16 26L10 24L9.5 19H12.5L13 21.5L16 22.5L19 21.5L19.5 17.5Z" fill="white"/>
            </svg>
        ),
        // Development Tools
        'vite': (
            <svg className={className} viewBox="0 0 32 32">
                <defs>
                    <linearGradient id={`vite-gradient-1-${name}`} x1="-.828%" y1="7.652%" x2="57.636%" y2="78.411%">
                        <stop offset="0%" stopColor="#41D1FF" />
                        <stop offset="100%" stopColor="#BD34FE" />
                    </linearGradient>
                    <linearGradient id={`vite-gradient-2-${name}`} x1="43.376%" y1="2.242%" x2="50.316%" y2="89.03%">
                        <stop offset="0%" stopColor="#FFEA83" />
                        <stop offset="8.333%" stopColor="#FFDD35" />
                        <stop offset="100%" stopColor="#FFA800" />
                    </linearGradient>
                </defs>
                <g transform="translate(2, 2) scale(0.09)">
                    <path 
                        fill={`url(#vite-gradient-1-${name})`}
                        d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 002.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62z"
                    />
                    <path 
                        fill={`url(#vite-gradient-2-${name})`}
                        d="M185.432.063L96.44 17.501a3.268 3.268 0 00-2.634 3.014l-5.474 92.456a3.268 3.268 0 003.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028 72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113z"
                    />
                </g>
            </svg>
        ),
        'vscode': (
            <svg className={className} viewBox="0 0 24 24">
                <g transform="scale(0.8) translate(4, 4)">
                    <path 
                        d="M15.5 2.7L12 1L5 8L2 5.5L0 6.5v11l2 1l3-2.5L12 23l3.5-1.7V2.7z" 
                        fill="#007ACC"
                    />
                    <path 
                        d="M12 17L6.5 12L12 7v10z" 
                        fill="#007ACC" 
                        fillOpacity="0.3"
                    />
                    <path 
                        d="M2 12.5v-1l1.5 0.5L2 12.5z" 
                        fill="#007ACC" 
                        fillOpacity="0.3"
                    />
                </g>
            </svg>
        ),
        // Styling
        'tailwind': (
            <svg className={className} viewBox="0 0 32 32">
                <path fill="#38B2AC" d="M9 13.7q1.4-5.6 7-5.6c5.6 0 6.3 4.2 9.1 4.9q2.8.7 4.9-2.1-1.4 5.6-7 5.6c-5.6 0-6.3-4.2-9.1-4.9q-2.8-.7-4.9 2.1Zm-7 8.4q1.4-5.6 7-5.6c5.6 0 6.3 4.2 9.1 4.9q2.8.7 4.9-2.1-1.4 5.6-7 5.6c-5.6 0-6.3-4.2-9.1-4.9q-2.8-.7-4.9 2.1Z"/>
            </svg>
        ),
        // Platform & Devices
        'mobile': (
            <svg className={className} viewBox="0 0 32 32">
                <path fill="currentColor" d="M20 4H12C10.897 4 10 4.897 10 6v20c0 1.103.897 2 2 2h8c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm-6 22h4v-1h-4v1zm5-3H13V7h6v16z"/>
            </svg>
        ),
        'responsive': (
            <svg className={className} viewBox="0 0 32 32">
                <path fill="currentColor" d="M28 4H10C8.897 4 8 4.897 8 6v2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h4v2c0 1.103.897 2 2 2h18c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM4 20V10h4v10H4zm6 2V8h18v14H10z"/>
            </svg>
        ),
        // Performance & Optimization
        'performance': (
            <svg className={className} viewBox="0 0 32 32">
                <path fill="currentColor" d="M16 4C9.383 4 4 9.383 4 16s5.383 12 12 12 12-5.383 12-12S22.617 4 16 4zm0 22c-5.514 0-10-4.486-10-10S10.486 6 16 6s10 4.486 10 10-4.486 10-10 10zm1-10.414V8h-2v8.414l4.293 4.293 1.414-1.414L17 15z"/>
            </svg>
        ),
        'seo': (
            <svg className={className} viewBox="0 0 32 32">
                <path fill="currentColor" d="M13 4C8.038 4 4 8.038 4 13c0 4.963 4.038 9 9 9 1.999 0 3.846-.656 5.333-1.76l6.958 6.959 1.414-1.414-6.959-6.958C20.844 17.846 21.5 15.999 21.5 14c0-4.962-4.037-9-9-9zm0 2c3.859 0 7 3.141 7 7s-3.141 7-7 7-7-3.141-7-7 3.141-7 7-7z"/>
            </svg>
        ),
        // Default
        'default': (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        'önerilenler': (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        'yeni':(
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.78 8.63L22 9.27L16.5 14.14L18.12 21.02L12 17.77L5.88 21.02L7.5 14.14L2 9.27L9.22 8.63L12 2Z" 
          fill="currentColor"/>
</svg>
        ),
        'reactrouter': (
            <svg className={className} viewBox="0 -58 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg">
	<g>
		<path d="M78.0659341,92.5875806 C90.8837956,92.5875806 101.274726,82.1966508 101.274726,69.3787894 C101.274726,56.5609279 90.8837956,46.1699982 78.0659341,46.1699982 C65.2480726,46.1699982 54.8571429,56.5609279 54.8571429,69.3787894 C54.8571429,82.1966508 65.2480726,92.5875806 78.0659341,92.5875806 Z M23.2087913,139.005163 C36.0266526,139.005163 46.4175825,128.614233 46.4175825,115.796372 C46.4175825,102.97851 36.0266526,92.5875806 23.2087913,92.5875806 C10.3909298,92.5875806 0,102.97851 0,115.796372 C0,128.614233 10.3909298,139.005163 23.2087913,139.005163 Z M232.791209,139.005163 C245.60907,139.005163 256,128.614233 256,115.796372 C256,102.97851 245.60907,92.5875806 232.791209,92.5875806 C219.973347,92.5875806 209.582418,102.97851 209.582418,115.796372 C209.582418,128.614233 219.973347,139.005163 232.791209,139.005163 Z" fill="#fff">

</path>
		<path d="M156.565464,70.3568084 C155.823426,62.6028163 155.445577,56.1490255 149.505494,51.6131676 C141.982638,45.8687002 133.461166,49.5960243 122.964463,45.8072968 C112.650326,43.3121427 105,34.1545727 105,23.2394367 C105,10.4046502 115.577888,0 128.626373,0 C138.29063,0 146.599638,5.70747659 150.259573,13.8825477 C155.861013,24.5221258 152.220489,35.3500418 159.258242,40.8041273 C167.591489,47.2621895 178.826167,42.5329154 191.362109,48.6517412 C195.390112,50.5026944 198.799584,53.4384578 201.202056,57.0769224 C203.604528,60.7153869 205,65.0565524 205,69.7183101 C205,80.633446 197.349674,89.7910161 187.035538,92.2861702 C176.538834,96.0748977 168.017363,92.3475736 160.494506,98.092041 C152.03503,104.551712 156.563892,115.358642 149.669352,126.774447 C145.756163,134.291567 137.802119,139.43662 128.626373,139.43662 C115.577888,139.43662 105,129.03197 105,116.197184 C105,106.873668 110.581887,98.832521 118.637891,95.1306146 C131.173833,89.0117889 142.408511,93.7410629 150.741758,87.2830007 C155.549106,83.5574243 156.565464,77.8102648 156.565464,70.3568084 Z" fill="#D0021B">

</path>
	</g>
</svg>
        ),
        'supabase': (
            <svg className="w-6 h-6" viewBox="0 0 64 64" fill="none">
            <defs>
                <linearGradient 
                    id={`supabase-gradient-1-${name}`}
                    x1="32" 
                    y1="0" 
                    x2="32" 
                    y2="64" 
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#249361" />
                    <stop offset="1" stopColor="#3ECF8E" />
                </linearGradient>
                <linearGradient 
                    id={`supabase-gradient-2-${name}`}
                    x1="32" 
                    y1="0" 
                    x2="32" 
                    y2="64" 
                    gradientUnits="userSpaceOnUse"
                >
                    <stop />
                    <stop offset="1" stopOpacity="0" />
                </linearGradient>
            </defs>
            <path 
                d="M37.412 62.937c-1.635 2.059-4.95.93-4.989-1.698l-.576-38.453h25.855c4.683 0 7.295 5.41 4.383 9.077l-24.673 31.074z" 
                fill={`url(#supabase-gradient-1-${name})`}
            />
            <path 
                d="M37.412 62.937c-1.635 2.059-4.95.93-4.989-1.698l-.576-38.453h25.855c4.683 0 7.295 5.41 4.383 9.077l-24.673 31.074z" 
                fill={`url(#supabase-gradient-2-${name})`}
                fillOpacity="0.2"
            />
            <path 
                d="M26.897 1.063c1.635-2.059 4.95-.93 4.99 1.698l.252 38.453H6.607c-4.683 0-7.295-5.41-4.383-9.077L26.897 1.063z" 
                fill="#3ECF8E"
            />
        </svg>
        ),
        'github':(
        <svg className="w-6 h-6  rounded-full"viewBox="0 -3.5 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet">

<g fill="#fff">

<path d="M127.505 0C57.095 0 0 57.085 0 127.505c0 56.336 36.534 104.13 87.196 120.99 6.372 1.18 8.712-2.766 8.712-6.134 0-3.04-.119-13.085-.173-23.739-35.473 7.713-42.958-15.044-42.958-15.044-5.8-14.738-14.157-18.656-14.157-18.656-11.568-7.914.872-7.752.872-7.752 12.804.9 19.546 13.14 19.546 13.14 11.372 19.493 29.828 13.857 37.104 10.6 1.144-8.242 4.449-13.866 8.095-17.05-28.32-3.225-58.092-14.158-58.092-63.014 0-13.92 4.981-25.295 13.138-34.224-1.324-3.212-5.688-16.18 1.235-33.743 0 0 10.707-3.427 35.073 13.07 10.17-2.826 21.078-4.242 31.914-4.29 10.836.048 21.752 1.464 31.942 4.29 24.337-16.497 35.029-13.07 35.029-13.07 6.94 17.563 2.574 30.531 1.25 33.743 8.175 8.929 13.122 20.303 13.122 34.224 0 48.972-29.828 59.756-58.22 62.912 4.573 3.957 8.648 11.717 8.648 23.612 0 17.06-.148 30.791-.148 34.991 0 3.393 2.295 7.369 8.759 6.117 50.634-16.879 87.122-64.656 87.122-120.973C255.009 57.085 197.922 0 127.505 0"/>

<path d="M47.755 181.634c-.28.633-1.278.823-2.185.389-.925-.416-1.445-1.28-1.145-1.916.275-.652 1.273-.834 2.196-.396.927.415 1.455 1.287 1.134 1.923M54.027 187.23c-.608.564-1.797.302-2.604-.589-.834-.889-.99-2.077-.373-2.65.627-.563 1.78-.3 2.616.59.834.899.996 2.08.36 2.65M58.33 194.39c-.782.543-2.06.034-2.849-1.1-.781-1.133-.781-2.493.017-3.038.792-.545 2.05-.055 2.85 1.07.78 1.153.78 2.513-.019 3.069M65.606 202.683c-.699.77-2.187.564-3.277-.488-1.114-1.028-1.425-2.487-.724-3.258.707-.772 2.204-.555 3.302.488 1.107 1.026 1.445 2.496.7 3.258M75.01 205.483c-.307.998-1.741 1.452-3.185 1.028-1.442-.437-2.386-1.607-2.095-2.616.3-1.005 1.74-1.478 3.195-1.024 1.44.435 2.386 1.596 2.086 2.612M85.714 206.67c.036 1.052-1.189 1.924-2.705 1.943-1.525.033-2.758-.818-2.774-1.852 0-1.062 1.197-1.926 2.721-1.951 1.516-.03 2.758.815 2.758 1.86M96.228 206.267c.182 1.026-.872 2.08-2.377 2.36-1.48.27-2.85-.363-3.039-1.38-.184-1.052.89-2.105 2.367-2.378 1.508-.262 2.857.355 3.049 1.398"/>

</g>

</svg>
    ),
    };

    return icons[iconName] || icons['default'];
};

CategoryIcon.propTypes = {
    name: PropTypes.string,
    className: PropTypes.string
};

CategoryIcon.defaultProps = {
    name: '',
    className: "w-6 h-6"
}; 