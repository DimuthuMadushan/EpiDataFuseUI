
import React, { useState, useEffect } from 'react';


class Documentation extends React.Component {
    render() {
        return (
            <div>
                <p><strong>EpiDataFuse Quickstart</strong></p>
                <p>EpiDataFuse allows researchers to easily build pipelines for <strong>collection, fusion and integration</strong> of <strong>spatio-temporal</strong>(collected across both space and time) data for an ample of use cases such as online machine learning and for continuous prediction using computational models in application domains such as disease surveillance, climate science and epidemiology. </p>
                <p><strong>Introduction to Spatio-temporal data and terminology</strong></p>
                <ol>
                    <li><strong>Spatio-temporal data</strong></li>
                </ol>
                <p>Spatio-temporal data is collected across both <strong>space</strong> and <strong>time</strong>. Spatial refers to space and temporal refers to time. A spatio-temporal data point is only valid in a particular spatial context and a temporal context. For instance, consider the following data frame which depicts the new Coivd-19 cases in each <strong>WHO region</strong> from <strong>October 26th  to November 9th</strong> of 2020.</p>
                <p><img src="./covid.png" alt="alt_text" /></p>
                <p>Figure 1.1: Data frame for covid cases</p>
                <p><img src="./regions.png" alt="alt_text" /></p>
                <p>Figure 1.2: WHO Regions</p>
                <p>As depicted above <strong>record 0</strong> is only valid in the   <strong>Americas WHO region</strong> and <strong>record 1</strong> is valid only in <strong>Europe WHO region</strong>. However, record 0 and 1 are both valid in the<strong> week ending on Nov 2nd</strong>.  In contrast, <strong>record 0 </strong>and <strong>record 6</strong> is valid in the <strong>Americas WHO region</strong>, but have different temporal contexts. The spatial and temporal context above is technically termed as granularity. In the above scenario, the number of covid-19 cases is the feature whereas the WHO region and the cumulative week(from Monday to Sunday) are respectively spatial and temporal granularities of the feature. </p>
                <p>In the above instance, Americas, Europe, South East Asia, Eastern Mediterranean Africa and Western Pacific are granules of <strong>WHO region</strong> spatial granularity, whereas <strong>Week 1(Nov2)</strong>, <strong>Week 2(Nov 9)</strong> are granules of <strong>Week</strong> temporal granularity. </p>
                <p>Above example depicts is only one type of spatio-temporal data where spatial locations/regions are treated as objects and measurements are collected over time to form features. This type of data is also known as <strong>Raster data</strong>. In addition, event data, trajectory data and point reference data are the other types of data which are summarized in a <a href="https://dl.acm.org/doi/10.1145/3161602">survey</a> done by Atluri et al. <strong>EpiDataFuse currently provide fusion mechanism for only raster data</strong>as raster data is the type that is heavily used in applications such as disease surveillance.</p>
                <ol>
                    <li><strong>Spatio-temporal granularity</strong></li>
                </ol>
                <p>As described above, spatio-temporal granularity is the spatial and temporal granularities(context of validity) of a particular data point. Further, multi-granular data are data which can be represented in multiple granularities. For instance, in the above example, the number of covid-19 cases is represented in  <strong>WHO region spatial granularity</strong> which is an aggregation of covid cases of <strong>countries</strong>, where <strong>WHO region</strong> is the coarser granularity and <strong>country</strong> is the finer granularity. Further, <strong>Country</strong> is a granularity which is an aggregation of <strong>Districts or States </strong>which can be further divided into locations of hospitals, labs, etc. As such, coarser granularities can be formed by aggregating finer granularities and finer granularities can be formed by dividing coarser granularities. The same applies to the temporal domain as well, which can easily be understood by the domain hierarchy of the temporal domain which is nanoseconds, microseconds, milliseconds, seconds, minutes, hours, days, etc. </p>
                <ol>
                    <li><strong>Spatial granularity</strong></li>
                </ol>
                <p>In the spatial domain, granularity can be defined in terms of geometry using a spatial object type. The following table summarizes the primitive types of spatial objects with corresponding example spatial granularities.</p>
                <table>
                    <tr>
                        <td><strong>Spatial object type</strong></td>
                        <td><strong>Spatial granularity</strong></td>
                    </tr>
                    <tr>
                        <td><strong>Point</strong></td>
                        <td>
                            <ol>
                                <li>Weather stations</li>
                                <li>Train Stations</li>
                                <li>Etc.</li>
                            </ol>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Line</strong></td>
                        <td>
                            <ol>
                                <li>Roads</li>
                                <li>Flight routes</li>
                                <li>Train tracks</li>
                                <li>Migration patterns of Animals</li>
                                <li>Etc.</li>
                            </ol>
                        </td>
                    </tr>
                    <tr>
                        <td><strong>Polygon</strong></td>
                        <td>Geopolitical regions and Administrative boundaries
                                    <ol>
                                <li>Continent</li>
                                <li>Country</li>
                                <li>WHO Region</li>
                                <li>MOH Area</li>
                                <li>Etc.</li>
                            </ol>
                        </td>
                    </tr>
                </table>

                <p>Multi-point, Multi-Line, Multi-Polygon are extensions of these primitive spatial objects that also used to define spatial granularities. For each granularity, there is a set of <strong>granules</strong>. For instance, if we consider <strong>Airports in the world </strong>as a granularity the set of airports around the globe forms the granules set for that particular granularity.</p>
                <ul>
                    <li>Los Angeles International Airport</li>
                    <li>Denver International Airport</li>
                    <li><a href="https://www.world-airport-codes.com/united-states/john-f-kennedy-international-5202.html">John F. Kennedy International Airport</a></li>
                    <li>Etc.</li>
                </ul>
                <p>One other example of granules is the Americas, Europe, South East Asia, Eastern Mediterranean Africa and Western Pacific regions depicted above in figure  1.2 to form MOH Region granularity.</p>
                <p><strong>4. Temporal granularity</strong></p>
                <p>In the temporal domain, the granularities can be considered the standardized units of measuring time which is known as the concept hierarchy of the temporal domain. Further, custom temporal granularities can be formed using standard units of measurement for the requirements of the application. Following table depicts some of the temporal granularities and granules of each granularity.</p>
                <table>
                    <tr>
                        <td>Temporal granularity</td>
                        <td>Granules</td>
                    </tr>
                    <tr>
                        <td>Second</td>
                        <td>1, 2, 3, … , 60</td>
                    </tr>
                    <tr>
                        <td>Minute</td>
                        <td>1,2,3, … ,60</td>
                    </tr>
                    <tr>
                        <td>Hour</td>
                        <td>1,2,3, … , 24</td>
                    </tr>
                    <tr>
                        <td>Day</td>
                        <td>1,2,3, … , 31</td>
                    </tr>
                    <tr>
                        <td>Week</td>
                        <td>Mon, Tue, … , Sun</td>
                    </tr>
                    <tr>
                        <td>Month</td>
                        <td>Jan, Feb, … , Dec</td>
                    </tr>
                    <tr>
                        <td>Quater</td>
                        <td>1,2,3,4</td>
                    </tr>
                    <tr>
                        <td>Year</td>
                        <td>…,  2000, 2001, 2002, … , 2020, ...</td>
                    </tr>
                    <tr>
                        <td>Season</td>
                        <td>Spring, Summer, Fall, Winter</td>
                    </tr>
                </table>


                <p>When spatial and temporal granularities are combined it creates a spatio-temporal granularity which makes spatio-temporal data comparatively complex. Moreover, the spatio-temporal granularity is heterogeneous from feature to feature. Due to this heterogeneity, it very difficult to integrate data points of different features to generate new combined or summarized data points. The following section describes the process of integration of spatio-temporal data.</p>
                <ol>
                    <li><p><strong>Fusing and Integrating spatio-temporal data points</strong></p>
                        <p> Fusion and integration of data points are performed to generate consumable data points. For instance, consider two data points <strong>a1</strong> and <strong>b1</strong> belonging to two different features A and B.  We can generate a new data point <strong>c1</strong> by Integrating <strong>a1</strong> and <strong>b1</strong>. Thereafter, the generated data point <strong>c1</strong> may be consumed by a computational model. However, integrating data points of two spatio-temporal features is more complex due to the deficient of spatial and temporal granularities in the two features. EpiDataFuse provides an abstract methodology to fuse and integrate spatio-temporal data,  eliminating the overhead of dealing with such complexity, </p>
                    </li>
                    <li><p><strong>Example scenario</strong></p>
                        <p> Following example depicts a scenario of providing consumable data for an online machine learning model for predicting the spread of the covid-19. </p>
                        <ol>
                            <li>The Dataset</li>
                            <li>Creating a fusion pipeline and configuring the pipeline</li>
                            <li>Initialize the fusion pipeline and observe the results</li>
                            <li>Addtional information</li>
                        </ol>
                    </li>
                </ol>

            </div>
        )
    }

}
export default Documentation;


