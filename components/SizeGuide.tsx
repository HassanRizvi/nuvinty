import React from 'react';

const SizeGuide = () => {
  return (
    <section style={{
      background: '#f8f6f3',
      padding: '60px 30px',
      fontFamily: 'Georgia, serif',
      color: '#333',
      maxWidth: '1100px',
      margin: '0 auto',
      lineHeight: 1.7,
      borderRadius: '12px'
    }}>
      <h1 style={{
        fontSize: '2.4em',
        color: '#8B6F47',
        marginBottom: '25px',
        fontWeight: 'normal'
      }}>
        International Size Guide
      </h1>

      <p style={{
        fontSize: '1em',
        marginBottom: '18px',
        color: '#444'
      }}>
        Use the following size guides to convert international sizes for clothing, footwear, and rings. Always refer to specific brand measurements when available. Since Nuvinty features products from various luxury brands and retailers, sizing can vary significantly between designers and regions. Always check the specific brand's size chart and product description. When in doubt, we recommend choosing the larger size or contacting our support team for personalized advice.
      </p>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2em', color: '#8B6F47' }}>How to Measure</h2>
        <br />
        <ul style={{ color: '#444', paddingLeft: '20px' }}>
          <li><strong>Bust/Chest:</strong> Measure around the fullest part of your bust/chest, keeping the tape measure level and close to your body but not tight.</li>
          <li><strong>Waist:</strong> Measure around your natural waistline, which is typically the narrowest part of your torso, about an inch above your belly button.</li>
          <li><strong>Hips:</strong> Measure around the widest part of your hips, typically about 7-9 inches below your natural waistline.</li>
          <li><strong>Inseam:</strong> Measure from the crotch seam to the bottom of the leg. This is best done with a pair of well-fitting pants.</li>
        </ul>
      </div>

      <h2 style={{
        fontSize: '2em',
        color: '#8B6F47',
        marginTop: '40px',
        marginBottom: '15px'
      }}>
        Clothing Size Chart (Women)
      </h2>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: 'white',
        border: '1px solid #ddd',
        marginBottom: '30px'
      }}>
        <thead>
          <tr style={{ background: '#eae0d5' }}>
            <th style={{ padding: '10px' }}>US</th>
            <th style={{ padding: '10px' }}>UK</th>
            <th style={{ padding: '10px' }}>EU</th>
            <th style={{ padding: '10px' }}>Italy</th>
            <th style={{ padding: '10px' }}>France</th>
            <th style={{ padding: '10px' }}>Japan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '10px' }}>2</td>
            <td style={{ padding: '10px' }}>6</td>
            <td style={{ padding: '10px' }}>34</td>
            <td style={{ padding: '10px' }}>38</td>
            <td style={{ padding: '10px' }}>36</td>
            <td style={{ padding: '10px' }}>5</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>4</td>
            <td style={{ padding: '10px' }}>8</td>
            <td style={{ padding: '10px' }}>36</td>
            <td style={{ padding: '10px' }}>40</td>
            <td style={{ padding: '10px' }}>38</td>
            <td style={{ padding: '10px' }}>7</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>6</td>
            <td style={{ padding: '10px' }}>10</td>
            <td style={{ padding: '10px' }}>38</td>
            <td style={{ padding: '10px' }}>42</td>
            <td style={{ padding: '10px' }}>40</td>
            <td style={{ padding: '10px' }}>9</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>8</td>
            <td style={{ padding: '10px' }}>12</td>
            <td style={{ padding: '10px' }}>40</td>
            <td style={{ padding: '10px' }}>44</td>
            <td style={{ padding: '10px' }}>42</td>
            <td style={{ padding: '10px' }}>11</td>
          </tr>
        </tbody>
      </table>

      <h2 style={{
        fontSize: '2em',
        color: '#8B6F47',
        marginTop: '40px',
        marginBottom: '15px'
      }}>
        Clothing Size Chart (Men)
      </h2>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: 'white',
        border: '1px solid #ddd',
        marginBottom: '30px'
      }}>
        <thead>
          <tr style={{ background: '#eae0d5' }}>
            <th style={{ padding: '10px' }}>US</th>
            <th style={{ padding: '10px' }}>UK</th>
            <th style={{ padding: '10px' }}>EU</th>
            <th style={{ padding: '10px' }}>Italy</th>
            <th style={{ padding: '10px' }}>France</th>
            <th style={{ padding: '10px' }}>Japan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '10px' }}>34</td>
            <td style={{ padding: '10px' }}>34</td>
            <td style={{ padding: '10px' }}>44</td>
            <td style={{ padding: '10px' }}>44</td>
            <td style={{ padding: '10px' }}>44</td>
            <td style={{ padding: '10px' }}>XS</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>36</td>
            <td style={{ padding: '10px' }}>36</td>
            <td style={{ padding: '10px' }}>46</td>
            <td style={{ padding: '10px' }}>46</td>
            <td style={{ padding: '10px' }}>46</td>
            <td style={{ padding: '10px' }}>S</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>38</td>
            <td style={{ padding: '10px' }}>38</td>
            <td style={{ padding: '10px' }}>48</td>
            <td style={{ padding: '10px' }}>48</td>
            <td style={{ padding: '10px' }}>48</td>
            <td style={{ padding: '10px' }}>M</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>40</td>
            <td style={{ padding: '10px' }}>40</td>
            <td style={{ padding: '10px' }}>50</td>
            <td style={{ padding: '10px' }}>50</td>
            <td style={{ padding: '10px' }}>50</td>
            <td style={{ padding: '10px' }}>L</td>
          </tr>
        </tbody>
      </table>

      <h2 style={{
        fontSize: '2em',
        color: '#8B6F47',
        marginTop: '40px',
        marginBottom: '15px'
      }}>
        Shoe Size Chart (Women)
      </h2>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: 'white',
        border: '1px solid #ddd',
        marginBottom: '30px'
      }}>
        <thead>
          <tr style={{ background: '#eae0d5' }}>
            <th style={{ padding: '10px' }}>US</th>
            <th style={{ padding: '10px' }}>UK</th>
            <th style={{ padding: '10px' }}>EU</th>
            <th style={{ padding: '10px' }}>JP (cm)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '10px' }}>5</td>
            <td style={{ padding: '10px' }}>3</td>
            <td style={{ padding: '10px' }}>36</td>
            <td style={{ padding: '10px' }}>22</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>6</td>
            <td style={{ padding: '10px' }}>4</td>
            <td style={{ padding: '10px' }}>37</td>
            <td style={{ padding: '10px' }}>23</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>7</td>
            <td style={{ padding: '10px' }}>5</td>
            <td style={{ padding: '10px' }}>38</td>
            <td style={{ padding: '10px' }}>24</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>8</td>
            <td style={{ padding: '10px' }}>6</td>
            <td style={{ padding: '10px' }}>39</td>
            <td style={{ padding: '10px' }}>25</td>
          </tr>
        </tbody>
      </table>

      <h2 style={{
        fontSize: '2em',
        color: '#8B6F47',
        marginTop: '40px',
        marginBottom: '15px'
      }}>
        Shoe Size Chart (Men)
      </h2>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: 'white',
        border: '1px solid #ddd',
        marginBottom: '30px'
      }}>
        <thead>
          <tr style={{ background: '#eae0d5' }}>
            <th style={{ padding: '10px' }}>US</th>
            <th style={{ padding: '10px' }}>UK</th>
            <th style={{ padding: '10px' }}>EU</th>
            <th style={{ padding: '10px' }}>JP (cm)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '10px' }}>7</td>
            <td style={{ padding: '10px' }}>6</td>
            <td style={{ padding: '10px' }}>40</td>
            <td style={{ padding: '10px' }}>25</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>8</td>
            <td style={{ padding: '10px' }}>7</td>
            <td style={{ padding: '10px' }}>41</td>
            <td style={{ padding: '10px' }}>26</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>9</td>
            <td style={{ padding: '10px' }}>8</td>
            <td style={{ padding: '10px' }}>42</td>
            <td style={{ padding: '10px' }}>27</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>10</td>
            <td style={{ padding: '10px' }}>9</td>
            <td style={{ padding: '10px' }}>43</td>
            <td style={{ padding: '10px' }}>28</td>
          </tr>
        </tbody>
      </table>

      <h2 style={{
        fontSize: '2em',
        color: '#8B6F47',
        marginTop: '40px',
        marginBottom: '15px'
      }}>
        Ring Size Chart
      </h2>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        background: 'white',
        border: '1px solid #ddd'
      }}>
        <thead>
          <tr style={{ background: '#eae0d5' }}>
            <th style={{ padding: '10px' }}>US Size</th>
            <th style={{ padding: '10px' }}>UK Size</th>
            <th style={{ padding: '10px' }}>EU Size</th>
            <th style={{ padding: '10px' }}>Inside Diameter (mm)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '10px' }}>5</td>
            <td style={{ padding: '10px' }}>J½</td>
            <td style={{ padding: '10px' }}>49</td>
            <td style={{ padding: '10px' }}>15.7</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>6</td>
            <td style={{ padding: '10px' }}>L½</td>
            <td style={{ padding: '10px' }}>52</td>
            <td style={{ padding: '10px' }}>16.5</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>7</td>
            <td style={{ padding: '10px' }}>N½</td>
            <td style={{ padding: '10px' }}>54</td>
            <td style={{ padding: '10px' }}>17.3</td>
          </tr>
          <tr>
            <td style={{ padding: '10px' }}>8</td>
            <td style={{ padding: '10px' }}>P½</td>
            <td style={{ padding: '10px' }}>57</td>
            <td style={{ padding: '10px' }}>18.2</td>
          </tr>
        </tbody>
      </table>

      <br />

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2em', color: '#8B6F47' }}>Sizing Tips for Luxury Fashion</h2>
        <ul style={{ color: '#444', paddingLeft: '20px' }}>
          <br />
          <li><strong>Designer Variations:</strong> Luxury brands often have unique sizing. Italian brands typically run small, while some French brands run large. Always check individual brand size charts.</li>
          <br />
          <li><strong>Vintage Sizing:</strong> Vintage pieces often run smaller than modern sizing. A vintage size 10 might fit like a modern size 6. Check measurements when available.</li>
          <br />
          <li><strong>Fabric Considerations:</strong> Stretch fabrics offer more flexibility in fit, while structured pieces like blazers require more precise sizing.</li>
          <br />
          <li><strong>When in Doubt:</strong> If you're between sizes, consider the garment type. For fitted pieces, choose the larger size. For oversized styles, you might prefer the smaller size.</li>
        </ul>
      </div>
    </section>
  );
};

export default SizeGuide;
